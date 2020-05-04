import { getSelectedValue } from './getSelectedValue';
import { getCheckedValues } from './getCheckedValues';
import { filterFields } from './filterFields';
// import flatten from 'lodash' - replace with custom to rm dependency

/**
 *
 * @param pages array
 * @returns {array}
 */
export const flattenPageFields = (pages) =>
  filterFields(flatten(pages.map((pg) => pg.fields)))

/**
 * Recursively iterates through each field object, returning arrays of the parent and all nested conditional fields
 * matching true conditions. The result of the reducer function is then flattened and unwanted values (undefined, null, etc)
 * are removed from the final array.
 *
 * @param fields array
 * @returns {array}
 */
export const flattenConditionalFields = fields => {
  const reducer = (acc, field) => {
    let fieldList = [field]
    if (field?.conditionals.length > 0) {
      const fieldConditionals = field.conditionals.reduce(
        (acc, obj) => acc.concat(obj.fields),
        []
      )
      fieldList = fieldList.concat(flattenConditionalFields(fieldConditionals))
    }
    return acc.concat(fieldList)
  }
  return filterFields(flatten(fields.reduce(reducer, [])))
}

/**
 *
 * @param fields array
 * @returns {object}
 */
export const reduceFieldValues = fields => fields.reduce((acc, field) => {
  acc[field.name] = getInitialFieldValue(field)
  return acc
}, {})

/**
 *
 * @param fields array
 * @returns {object}
 */
export const getFieldValueHash = fields => reduceFieldValues(flattenConditionalFields(fields))

/**
 *
 * @param fields array
 * @returns {array} - containing an object w/ default values for initial repeatable field set
 */
export const getRepeatableValues = fields => fields && fields.length > 0 ? [getFieldValueHash(fields)] : []

/**
 *
 * @param field object - destructured field obj
 * @returns {string|object|array|null}
 */
export const getInitialFieldValue = ({type, choices, fields, value}) => {
  const valueByType = {
    checkbox: choices ? getCheckedValues(choices) : [],
    custom: value || '',
    radio: choices ? getSelectedValue(choices) : '',
    repeatable: value || getRepeatableValues(fields),
    select: choices ? getSelectedValue(choices) : '',
    text: value || '',
  }
  return type && valueByType.hasOwnProperty(type)
    ? valueByType[type]
    : valueByType.text
}

/**
 * Generates a flat hash of all possible fields and their corresponding default values for controlled form state.
 * @param pages array
 * @returns {object}
 */
export const getInitialValues = (pages) =>
  pages != null ? getFieldValueHash(flattenPageFields(pages)) : {}
