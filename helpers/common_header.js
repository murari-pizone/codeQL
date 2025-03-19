function headerBody(key) {
  if (key === 'ERP') {
    return {
      'Content-Type': 'application/json',
      'x-api-key':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfZ2tleSI6IlJlc3RTZWxmT3JkVXNyR0tleSIsImlhdCI6MTU3NzI0OTk4Nn0.V4nqfD51NhIKvQpcbIShBOxQFwiMgJEk3Z9Fim3WkmY',
    };
  } else if (key === 'SWIGGY') {
    return {
      // 'Authorization Key': 'your_authorization_key_here',
      tokenid: 'aab',
      'Content-Type': 'application/json',
    };
  } else {
    return {
      // 'Authorization Key': 'your_authorization_key_here',
      'api-key': 'AAB',
      'Content-Type': 'application/json',
    };
  }
}
function contentBody(key, res) {
  if (key === 'getMenuBody') {
    return {
      RequestType: 'ListOfMenuItems',
      MySId: 'z4f!c83%634f.g#9g',
      Maincat: 'AAB SWEETS',
      Subcat: 'ALL',
      ExtPlatForm: 'ONDC',
      Region: res.Region,
      ShopCode: res.ShopCode,
    };
  } else if (key === 'getMenuTimingBody') {
    return {
      RequestType: 'MenuCategoryTiming',
      MySId: 'z4f!c83%634f.g#9g',
      Maincat: 'AAB SWEETS',
      Subcat: 'ALL',
      ExtPlatForm: 'ONDC',
      Region: res.Region,
      ShopCode: res.ShopCode,
    };
  } else if (key === 'getOutlets') {
    return {
      MySId: 'z4f!c83%634f.g#9g',
      Region: 'ALL',
    };
  } else if (key === 'storToggle') {
    return {
      partnerid: res.partnerid,
      isRequestedToOpen: res.isRequestedToOpen,
    };
  }
}

function apiERPEndPoint() {
  return {
    getOutlets: 'listofonlineorderoutlets',
    getMenuOfOutlet: 'Listofitemsforonlineorders',
    pushOrder: 'placeOrderDlyV4',
    cancelOrder: 'cancelonlineorder',
    s_storToggle: 'partner/toggle',
    s_itemToggle: 'v1/partner/itemtoggle',
    oderEdit: 'external/order/v1/items/oos/',
    order_confirm: 'external/order/confirm',
    order_mfr: 'external/order/mark-food-ready',
  };
}

module.exports = { headerBody, contentBody, apiERPEndPoint };
