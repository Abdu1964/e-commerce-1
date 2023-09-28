const Validator = require('validator');
const isEmpty = require('./isempty');

module.exports = function validateProductInput(data) {
  let errors = {};

  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'quantity field is required';
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'price field is required';
  }

   

  return {
    errors,
    isValid: isEmpty(errors)
  };
};