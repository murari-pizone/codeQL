const createResponse = (success, data = null, message = '', statusCode = 200) => {
  return {
    success,
    data,
    message,
    statusCode,
  };
};
const createResponseMenu = (data, success, request_id, error, message, statusCode) => {
  return {
    data,
    success,
    request_id,
    error,
    message,
    statusCode,
  };
};
const userLogin = (success, userId, token = null, message = '', statusCode = 200) => {
  return {
    success,
    userId,
    token,
    message,
    statusCode,
  };
};
const forget = (success, userId, message = '', statusCode = 200) => {
  return {
    success,
    userId,
    message,
    statusCode,
  };
};
const badRequest = (success, message = '', statusCode = 200) => {
  return {
    success,
    message,
    statusCode,
  };
};
const orderErrorResponse = (
  status_code,
  status_message,
  timestamp,
  external_order_id,
  swiggy_order_id,
  description,
) => {
  if (external_order_id === null) {
    return {
      status_code,
      status_message,
      timestamp,
      swiggy_order_id,
    };
  } else {
    return {
      status_code,
      status_message,
      timestamp,
      external_order_id,
      swiggy_order_id,
      description,
    };
  }
};
const orderRelayResponse = (
  timestamp,
  status_code,
  status_message,
  external_order_id,
  swiggy_order_id,
  description,
) => {
  return {
    timestamp,
    status_code,
    status_message,
    external_order_id,
    swiggy_order_id,
    description,
  };
};
const orderConfirm = (statusCode, data, statusMessage) => {
  return {
    statusCode,
    data,
    statusMessage,
  };
};
const errorObj = (message, code = 400) => {
  return {
    message,
    code,
  };
};

module.exports = {
  createResponseMenu,
  createResponse,
  userLogin,
  badRequest,
  forget,
  orderErrorResponse,
  orderRelayResponse,
  orderConfirm,
  errorObj,
};
