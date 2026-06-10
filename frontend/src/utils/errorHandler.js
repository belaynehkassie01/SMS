// utils/errorHandler.js
export const parseApiError = (error) => {
  // Default message
  let message = 'An unexpected error occurred. Please try again.';
  
  if (!error) return message;
  
  // Axios error with response
  if (error.response) {
    const { status, data } = error.response;
    
    // Use server-provided message if exists
    if (data && typeof data === 'object') {
      if (data.message) message = data.message;
      else if (data.error) message = data.error;
    }
    
    // Add status-specific context
    switch (status) {
      case 400:
        message = message === 'An unexpected error occurred.' ? 'Invalid request. Please check your input.' : message;
        break;
      case 401:
        message = 'Session expired or invalid credentials. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = 'Conflict with existing data.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        break;
    }
  } 
  // Network error (no response)
  else if (error.request) {
    message = 'Network error. Please check your internet connection.';
  }
  // Something else
  else {
    message = error.message || message;
  }
  
  return message;
};

export const isSessionExpiredError = (error) => {
  return error?.response?.status === 401;
};