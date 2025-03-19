exports.getOrderJSON = async (res, key) => {
  if (key === 'MFR') {
    return {
      timestamp: '2018-06-28 11:49:18',
      swiggy_order_id: 1,
      external_order_id: '4798242761',
    };
  } else if (key === 'CONFIRM') {
    return {
      timestamp: '2017-09-09 12:12:12',
      timestamp_outlet: '2017-09-09 12:12:12',
      swiggy_order_id: 1,
      external_order_id: '1X',
      description: 'callback reason',
      metadata: {
        xyz: 'abc',
      },
    };
  } else if (key === 'PUTORDER') {
    return {
      order_id: '1234455',
      external_restaurant_id: 'external_restaurant_id',
      edit_allowed: 'true',
      oos_data: [
        {
          item: {
            item_id: 'external_item_id1',
          },
        },
        {
          item: {
            item_id: 'external_item_id2',
          },
        },
      ],
    };
  } else {
    return '';
  }
};
