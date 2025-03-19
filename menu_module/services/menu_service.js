const { sequelize } = require('../../config/db');
const menuModel = require('../models/menu_model');
const validateMenu = require('../validators/validator');
const logger = require('../../utils/logger');
const cron = require('node-cron');

class MenuService {
  constructor() {
    this.menuModel = new menuModel(this);
  }

  async syncMenuError(req) {
    logger.info('Sync menu error processing started.');
    return this.processMenuModelRequest('syncMenuError', req);
  }
  async syncMenuTrack(req) {
    logger.info('Sync menu Track processing started.');
    return this.processMenuModelRequest('syncMenuTrack', req);
  }

  async verifyStatusSyncMenu() {
    logger.info('Verifying status of sync menu.');
    return this.processMenuModelRequest('verifyStatusSyncMenu');
  }

  async publishSyncMenu(outlets) {
    let cronSchedule = true;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Add 1 minute to the current time

    const minute = now.getMinutes();
    const hour = now.getHours();
    const dayOfMonth = now.getDate();
    const month = now.getMonth() + 1;
    const dayOfWeek = now.getDay();

    setTimeout(() => {
      cron.schedule(`${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, async () => {
        const outlet = outlets;
        if (cronSchedule) {
          const response = await this.publishMenu(outlet);
          logger.info('All menu synced successfully for scheduled task.', response);
          cronSchedule = false;
        }
      });
    }, 1000); // 1 minute delay

    logger.info('Cron job scheduled for menu sync.');
    return {
      status: 'OK',
      message: 'The items are syncing. You will see the sync menu error screen after a while.',
      statusCode: 200,
    };
  }

  async getMenu(req) {
    const body = req?.body;

    const { error } = validateMenu.validateGetMenu(body);
    if (error) {
      logger.error('Validation error in getMenu:', error.details[0].message);
      throw new Error(error.details[0].message);
    }

    logger.info('Fetching menu data.');
    return this.processMenuModelRequest('getMenu', req);
  }

  async createMenu(data) {
    logger.info('Creating menu on Swiggy.');
    return this.processMenuModelRequest('createMenuOnSwiggy', data);
  }

  async syncMenuItems(item) {
    const { ShopCode } = item;
    const { error } = validateMenu.validateGetMenu(item);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const items = await this.executeSP(`EXEC [dbo].[mw_GetAllMenuItemsByOutletId] @outlet = ${ShopCode}`);

    // Generate payload
    const menuPayload = await this.generateMenuPayload(ShopCode, JSON.parse(items[0]?.data));
    return this.processMenuModelRequest('createMenuOnSwiggy', menuPayload, ShopCode);
  }

  async generateMenuPayload(outlet, records) {
    const payload = {
      entity: {
        main_categories: [],
        items: [],
      },
    };
    const items = [];
    const seenIcodes = new Set();

    await records.forEach((item) => {
      if (!seenIcodes.has(item.Icode)) {
        seenIcodes.add(item.Icode);
        items.push(item);
      }
    });

    // Create main categories and subcategories
    const mainCategoryMap = new Map();

    items.forEach((item) => {
      const mainCategoryId = item.MainCategoryId;
      if (!mainCategoryMap.has(mainCategoryId)) {
        mainCategoryMap.set(mainCategoryId, {
          id: mainCategoryId,
          name: item.MainCategoryName,
          description: `${item.MainCategoryName || 'No description Provided'}.`,
          order: item.MainCategorySortOrder || 0,
          sub_categories: [],
        });
      }

      const category = {
        id: item.CategoryId,
        name: item.CategoryName,
        category_id: mainCategoryId,
        description: `${item.CategoryName || 'No description Provided'} `,
        order: item.CategorySortOrder || 0,
      };

      const mainCategory = mainCategoryMap.get(mainCategoryId);
      if (!mainCategory.sub_categories.some((cat) => cat.id === category.id)) {
        mainCategory.sub_categories.push(category);
      }
    });

    payload.entity.main_categories = Array.from(mainCategoryMap.values());

    // Create items with dynamic variants, addons, and pricing combinations
    items.forEach((item) => {
      if (item.Uom === 'NOS') {
        item.Uom = 'pieces';
        item.IndWeight = '0';
      } else if (item.Uom === 'KGS') {
        item.Uom = 'kg';
        item.IndWeight = '1';
      } else if (item.Uom === 'PAKTS') {
        item.Uom = 'pieces';
        item.IndWeight = '1';
      }

      const menuItem = {
        id: item.Icode.toString(),
        category_id: item.MainCategoryId,
        sub_category_id: item.CategoryId,
        name: item.Iname,
        is_veg: true, // Adjust based on data
        description: item.WebItmDescription || 'No description Provided',
        price: item.RateWithoutTax,
        gst_details: {
          igst: 0.0,
          sgst: 0.0,
          cgst: 0.0,
          inclusive: true,
          gst_liability: 'SWIGGY',
        },
        packing_charges: 0,
        enable: item.LiveStatus === 'Enabled' ? 1 : 0,
        in_stock: item.OptionSaleYN === 'Y' ? 1 : 1,
        catalog_attributes: {
          spice_level: 'NOT_APPLICABLE',
          sweet_level: 'HIGH',
          gravy_property: 'NOT_APPLICABLE',
          bone_property: 'NOT_APPLICABLE',
          contain_seasonal_ingredients: false,
          quantity: {
            value: item.IndWeight ? item.IndWeight : null,
            unit: item.Uom ? item.Uom : null,
          },
          serves_how_many: 1,
        },
        variant_groups: [],
        addon_groups: [],
        pricing_combinations: [], // Initialize pricing combinations
      };

      // Dynamically add variants if OptionGroupName is available and not "0"
      if (item.OptionGroupName && item.OptionGroupName !== '0') {
        const cleanOptionGroupName = item.OptionGroupName.startsWith('OG-')
          ? item.OptionGroupName.slice(3)
          : item.OptionGroupName;
        const options = cleanOptionGroupName.split('/');

        menuItem.variant_groups = [
          {
            id: `VG-${item.Icode}`,
            name: 'Weight Options',
            order: 1,
            item_id: item.Icode.toString(),
            variants: options.map((option, index) => ({
              id: `V-${item.Icode}-${index + 1}`,
              name: `${option}g`,
              item_id: item.Icode.toString(),
              price: (item.RateWithoutTax / 1000) * parseFloat(option),
              in_stock: 1,
              variant_group_id: `VG-${item.Icode}`,
              is_veg: true,
              order: index + 1,
              default: index === 0, // Mark the first variant as default
            })),
          },
        ];

        // Add pricing combinations if variant_groups are present
        if (menuItem.variant_groups.length > 0) {
          menuItem.pricing_combinations = options.map((option, index) => ({
            variant_combination: [
              {
                variant_group_id: `VG-${item.Icode}`,
                variant_id: `V-${item.Icode}-${index + 1}`,
              },
            ],
            price: (item.RateWithoutTax / 1000) * parseFloat(option),
            addon_combination: [], // Addons can be included here if applicable
          }));
        }
      }

      // Only add pricing_combinations if variant_groups are not empty
      if (menuItem.variant_groups.length === 0) {
        delete menuItem.pricing_combinations;
      }

      payload.entity.items.push(menuItem);
    });

    return payload;
  }
  // this will chnage the fetchdata value in outlets table to true in case of cron job menu sync error

  async requiredField(data) {
    const missingFields = [];
    if (data?.entity?.main_categories?.length === 0) {
      missingFields.push({
        error: 'all main_categories missed',
      });
    }
    // Check main categories
    data.entity.main_categories.forEach((category) => {
      if (!category.id || typeof category.id !== 'string' || category.id.length > 50) {
        missingFields.push({ field: 'category.id', value: category.id });
      }
      if (!category.name || typeof category.name !== 'string' || category.name.length > 50) {
        missingFields.push({ field: 'category.name', value: category.name });
      }

      // Check sub-categories inside categories
      category.sub_categories.forEach((subCategory) => {
        if (!subCategory.id || typeof subCategory.id !== 'string' || subCategory.id.length > 50) {
          missingFields.push({
            field: 'sub-category.id',
            value: subCategory.id,
          });
        }
        if (
          !subCategory.category_id ||
          typeof subCategory.category_id !== 'string' ||
          subCategory.category_id.length > 50
        ) {
          missingFields.push({
            field: 'sub-category.category_id',
            value: subCategory.category_id ? subCategory.category_id : 'missing',
          });
        }
        if (!subCategory.name || typeof subCategory.name !== 'string' || subCategory.name.length > 50) {
          missingFields.push({
            field: 'sub-category.name',
            value: subCategory.name,
          });
        }
      });
    });

    // Check items
    if (data.entity.items?.length === 0) {
      missingFields.push({
        error: 'all item missed',
      });
    }
    data.entity.items.forEach((item) => {
      if (!item.id || typeof item.id !== 'string' || item.id.length > 50) {
        missingFields.push({ field: 'item.id', value: item.id });
      }
      if (!item.category_id || typeof item.category_id !== 'string' || item.category_id.length > 50) {
        missingFields.push({
          field: 'item.category_id',
          value: item.category_id,
        });
      }
      if (!item.name || typeof item.name !== 'string' || item.name.length > 50) {
        missingFields.push({ field: 'item.name', value: item.name });
      }
      if (typeof item.is_veg !== 'boolean') {
        missingFields.push({ field: 'item.is_veg', value: item.is_veg });
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        missingFields.push({ field: 'item.price', value: item.price });
      }
      if (item.variant_groups && Array.isArray(item.variant_groups)) {
        item.variant_groups.forEach((variantGroup) => {
          if (!variantGroup.id || typeof variantGroup.id !== 'string') {
            missingFields.push({
              field: 'variant-group.id',
              value: variantGroup.id,
            });
          }
          if (!variantGroup.name || typeof variantGroup.name !== 'string') {
            missingFields.push({
              field: 'variant-group.name',
              value: variantGroup.name,
            });
          }
          if (!variantGroup.item_id || typeof variantGroup.item_id !== 'string') {
            missingFields.push({
              field: 'variant-group.item_id',
              value: variantGroup.item_id,
            });
          }

          // Check variants inside variant group
          variantGroup.variants.forEach((variant) => {
            if (!variant.id || typeof variant.id !== 'string') {
              missingFields.push({ field: 'variant.id', value: variant.id });
            }
            if (!variant.name || typeof variant.name !== 'string') {
              missingFields.push({
                field: 'variant.name',
                value: variant.name,
              });
            }
            if (!variant.item_id || typeof variant.item_id !== 'string') {
              missingFields.push({
                field: 'variant.item_id',
                value: variant.item_id,
              });
            }
            if (!variant.variant_group_id || typeof variant.variant_group_id !== 'string') {
              missingFields.push({
                field: 'variant.variant_group_id',
                value: variant.variant_group_id,
              });
            }
            if (typeof variant.price !== 'number') {
              missingFields.push({
                field: 'variant.price',
                value: variant.price,
              });
            }
            if (typeof variant.is_veg !== 'boolean') {
              missingFields.push({
                field: 'variant.is_veg',
                value: variant.is_veg,
              });
            }
          });
        });
      }
    });
    const uniqueArray = missingFields.filter(
      (value, index, self) => index === self.findIndex((t) => t.field === value.field),
    );
    return uniqueArray;
  }

  async executeSP(query, replacements) {
    try {
      const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      throw new Error('Database query for execution Store Procedure failed: ' + error.message);
    }
  }
  async processMenuModelRequest(action, ...data) {
    try {
      const params = data.length > 0 ? data : [];
      return new Promise((resolve, reject) => {
        this.menuModel[action](...params, (err, result) => {
          if (err) {
            if (err instanceof Error) {
              reject(err);
            } else if (typeof err === 'object') {
              reject(new Error(err.message));
            } else {
              reject(new Error(err.message));
            }
          } else {
            resolve(result);
          }
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createItem(req, key) {
    return this.processMenuModelRequest('createItem', req, key);
  }
  async removeItem(req, key) {
    return this.processMenuModelRequest('removeItem', req, key);
  }
}

module.exports = new MenuService();
