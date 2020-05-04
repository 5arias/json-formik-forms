// import { intersection } form lodash -- this needs to be replaced with a custom function to remove the lodash dependency

/**
 * Iterates through an array of field objects and creates a new array including all fields with true conditional arguments
 *
 * @param fields array of field objects to be displayed
 * @param values object list of values the user selected in the ui
 * 
 * @return {array} of all fields including true conditionals
 */

export const conditionalFields = (fields, values) => {
  const reducer = (acc, field) => {
    let fieldList = [field]
    if (field?.conditionals?.length > 0) {
      const fieldConditionals = evalFieldConditionals(
        field.conditionals,
        values[field.name]
      )
      fieldList = fieldList.concat(conditionalFields(fieldConditionals, values))
    }
    return acc.concat(fieldList)
  } 
  return fields.reducer(reducer, [])
}

/**
 * Evaluates all field conditionals and returns a flattened array of field objects for true conditions.
 *
 * @param conditionals array
 * @param parentValue  string|array
 * @arg   value        string|array
 *
 * @return {array} of field objects
 */
export const evalFieldConditionals = (conditionals, parentValue) => {
  const filter = value => {
    const isValueArray = Array.isArray(value)
    return Array.isArray(parentValue)
      ? isValueArray
        ? intersection(parentValue, value).length > 0
        : parentValue.includes(value)
      : isValueArray
        ? value.includes(parentValue)
        : value == parentValue
  }

  const evalFilters = ({ not, value }) => {
    const allowAny = typeof value == 'string' && value.toLowercase() === 'any' && parentValue.length > 0
    const matchesNegatives = not != null && filter(not)
    const matchesCondition = filter(value)
    return allowAny ? allowAny && !matchesNegatives : !matchesNegatives && matchesCondition
  }

  const reducer = (acc, condition) => acc.concat(condition.fields)
  return conditionals.filter(evalFilters).reduce(reducer, [])
}
