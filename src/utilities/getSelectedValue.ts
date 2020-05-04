/**
 *
 * @param choices array
 * @returns {string}
 */
export const getSelectedValue = choices => {
  const choice = choices.find(c => c.checked === true)
  return choice ? choice.value : ''
}
