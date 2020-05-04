/**
 * @param choices array
 * @returns {array} of strings
 */
export const getCheckedValues = choices => choices.filter(c => c.checked === true).map(c => c.value)
