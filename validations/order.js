const Validator = require('validator');
const isEmpty = require('./isempty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.products) ? data.products : '';
  data.skills = !isEmpty(data.quantity) ? data.quantity : '';
  data.skills = !isEmpty(data.shippingAddress) ? data.shippingAddress : '';

  // Handle checks
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle must be between 2 and 40 characters';
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  // products checks
  if (Validator.isEmpty(data.products)) {
    errors.products = 'products field is required';
  }

  // quantity checks
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'quantity field is required';
  }
  

    // shippingAddress checks
    if (Validator.isEmpty(data.shippingAddress)) {
      errors.shippingAddress = 'shippingAddress field is required';
    }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};