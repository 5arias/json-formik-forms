import { getIn } from 'formik'

/**
 *
 * @param errors object
 * @param name string
 * @param touched object
 * @returns {string|null}
 */
export const getErrorMessage = ({ errors, name, touched}) => {
  const error = getIn(errors, name)
  const touch = getIn(touched, name)
  return name && touch && error ? error : null
}
