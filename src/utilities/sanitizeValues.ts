import { filterFields } from './filterFields'
// import flatten from 'lodash.flatten' - replace with custom to rm need for dependency
import { conditionalFields } from './conditionalFields'

/**
 *
 * @param pages array - collection of page objects
 * @param values object - form values provided from formik state
 * @returns {array} - flattened collection of all fields with true conditions
 */
export const getValidFields = (pages, values) => {
  return pages.map(page => {
    const { fields } = page
    return fields && fields.length > 0
      ? filterFields(conditionalFields(fields, values))
      : fields
  })
}

/**
 *
 * @param fields array
 * @returns {array}
 */
export const getValidFieldNames = (fields) =>
  filterFields(flatten(fields)).map((f) => f.name)

/**
 *
 * @param pages array - collection of page objects form schema
 * @param values object - values provided from formik state
 * @returns {object} - values for only valid fields (branching & conditions)
 */
export const sanitizeValues = (pages, values) => {
  const validFields = getValidFields(pages, values)
  const validFieldNames = getValidFieldNames(validFields)

  return validFieldNames.reduce((sanitizedValues, field) => {
    sanitizedValues[field] = values[field]
    return sanitizedValues
  }, {})
}
