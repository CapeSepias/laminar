import {
  childOptions,
  CombineResults,
  HasError,
  isJsonSchema,
  isObject,
  NoErrors,
  validateSchema,
} from '../helpers';
import { Validator } from '../types';

export const validateAdditionalProperties: Validator = (schema, value, options) => {
  if (
    isJsonSchema(schema) &&
    schema.additionalProperties !== undefined &&
    schema.additionalProperties !== true &&
    isObject(value)
  ) {
    const { properties, additionalProperties, patternProperties } = schema;

    const additionalKeys = Object.keys(value)
      .filter(key => !(properties && key in properties))
      .filter(
        key =>
          !(
            patternProperties &&
            Object.keys(patternProperties).some(pattern => RegExp(pattern).test(key))
          ),
      );

    if (additionalKeys.length > 0) {
      if (additionalProperties === false) {
        return HasError('additionalProperties', options.name, additionalKeys);
      } else if (isObject(additionalProperties)) {
        return CombineResults(
          additionalKeys.map(key =>
            validateSchema(additionalProperties, value[key], childOptions(key, options)),
          ),
        );
      }
    }
  }
  return NoErrors;
};
