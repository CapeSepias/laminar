import { HasError, isJsonSchema, NoErrors, validateSchema } from '../helpers';
import { Validator } from '../types';

export const validateAnyOf: Validator = (schema, value, options) => {
  if (isJsonSchema(schema) && schema.anyOf && schema.anyOf.length > 0) {
    if (schema.anyOf.length === 1) {
      return validateSchema(schema.anyOf[0], value, options);
    } else {
      if (
        !schema.anyOf
          .map(item => validateSchema(item, value, options))
          .some(result => result.errors.length === 0)
      ) {
        return HasError('anyOf', options.name);
      }
    }
  }
  return NoErrors;
};
