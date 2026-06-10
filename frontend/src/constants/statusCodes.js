// constants/statusCodes.js
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const getStatusText = (code) => {
  const map = {
    [HTTP_STATUS.OK]: 'Success',
    [HTTP_STATUS.CREATED]: 'Created',
    [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
    [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
    [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
    [HTTP_STATUS.NOT_FOUND]: 'Not Found',
    [HTTP_STATUS.CONFLICT]: 'Conflict',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server Error',
  };
  return map[code] || 'Unknown Error';
};