import {
  childOptions,
  CombineResults,
  isJsonSchema,
  isObject,
  NoErrors,
  validateSchema,
} from '../helpers';
import { Validator } from '../types';

export const validatePropertyNames: Validator = (schema, value, options) => {
  if (isJsonSchema(schema) && schema.propertyNames !== undefined && isObject(value)) {
    const { propertyNames } = schema;
    return CombineResults(
      Object.keys(value).map(key => validateSchema(propertyNames, key, childOptions(key, options))),
    );
  }
  return NoErrors;
};
