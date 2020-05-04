/**
 * Evaluates if a field should be filtered out of the parent array
 *
 * @param field object
 * @return {boolean}
 */
export const filterExcludedFieldTypes = field => {
  const excludedFieldTypes = ['content']
  return field != null && field.type && !excludedFieldTypes.includes(field.type)
}

/**
 * Removes any undefined, null, or content fields from an array
 *
 * @param array original field objects
 * @return {array} new array of filtered field objects
 */
export const filterFields = array => array.filter(filterExcludedFieldTypes)
