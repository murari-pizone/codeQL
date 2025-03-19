function queryForTableCreate() {
  return `
CREATE TABLE IF NOT EXISTS mw_outlets_menu_list (
StatusResponse VARCHAR(20),
ExtPlatform VARCHAR(20),
State VARCHAR(20),
Region VARCHAR(10),
Brcode INT,
Branch VARCHAR(50),
MainCategorySortOrder INT,
MainCategoryId VARCHAR(10),
MainCategoryName VARCHAR(50),
CategorySortOrder INT,
CategoryId VARCHAR(10),
CategoryName VARCHAR(50),
Icode INT,
Iname VARCHAR(50),
Uom VARCHAR(10),
RateWithoutTax DECIMAL(10, 2),
GST DECIMAL(5, 2),
OptionSaleYN CHAR(1),
LiveStatus VARCHAR(10),
Included_platforms VARCHAR(10),
WebItmDescription TEXT,
Recommended VARCHAR(20),
OptionGroupName VARCHAR(20),
IndWeight DECIMAL(10, 2),
CountryCode VARCHAR(10),
CountryName VARCHAR(50)
    ); `;
}
function queryForTableInsert() {
  return `
         INSERT INTO mw_outlets_menu_list (
     StatusResponse, ExtPlatform, State, Region, Brcode, Branch, MainCategorySortOrder,
     MainCategoryId, MainCategoryName, CategorySortOrder, CategoryId, CategoryName,
     Icode, Iname, Uom, RateWithoutTax, GST, OptionSaleYN, LiveStatus,
     Included_platforms, WebItmDescription, Recommended, OptionGroupName, 
     IndWeight, CountryCode, CountryName
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
   `;
}

function deleteQuery() {
  return 'DELETE FROM mw_outlets_menu_list WHERE Brcode = ?';
}

module.exports = {
  queryForTableCreate,
  queryForTableInsert,
  deleteQuery,
};
