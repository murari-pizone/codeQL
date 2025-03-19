// src/services/ERPRequest.js

class ERPRequest {
  constructor(orderData) {
    this.orderData = orderData;
  }

  generateBody() {
    const shopCode = this.orderData.outlet_id;
    const billAmt = this.orderData.restaurant_gross_bill + this.orderData.order_packing_charges_gst;
    const overallDiscountAmount = 0.0;
    const discountMaxCap = 0;
    const onlineOrderId = this.orderData.order_id;
    const externalOrderId = this.orderData.id;
    const cpnCode = '';
    const splInstructions = this.orderData.instructions;
    const custMobNo = this.orderData.customer_phone_number;
    const mySId = 'S23lsk23pjdflkg098245lk23sh254@98$&65%0909xcvxv#%d';

    const itemDetails = this.orderData.items
      .map((item) => {
        const productCode = item.id || item.name;
        const orderedQuantity = item.quantity;
        const discount = item.item_restaurant_offers_discount || 0;
        const sgst = item.sgst || 0;
        const cgst = item.cgst || 0;
        const taxValue = sgst + cgst;
        const taxPercentage = item.sgst_percent || item.cgst_percent || 0;
        const itemRate = item.price;
        const description = item?.description || 'NIL';

        return `${productCode}|${orderedQuantity}|${discount}|${description}|${taxValue.toFixed(2)}|GOODS|${taxPercentage}|${itemRate}`;
      })
      .join('~');

    return {
      ShopCode: shopCode,
      ItemDetails: itemDetails,
      BillAmt: billAmt,
      OverallDiscountAmount: overallDiscountAmount,
      DiscountMaxCap: discountMaxCap,
      OnlineOrderId: onlineOrderId,
      ExternalOrderId: externalOrderId,
      CpnCode: cpnCode,
      SPL_INSTRUCTIONS: splInstructions,
      CustMobNo: custMobNo,
      MySId: mySId,
    };
  }

  generateHeaders() {
    const { headerBody } = require('../../helpers/common_header');
    return headerBody('ERP');
  }
}

module.exports = ERPRequest;
