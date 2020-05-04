import * as React from 'react'
import { Field as FormikField } from 'formik'
import { FormRepeatableField } from './FormRepeatableField'
import { getErrorMessage } from '../utilities'

// interface Props {
//   text: string
// }

// export const FormField = ({ text }: Props) => {
//   return <div>Field Component: {text}</div>
// }

export const FormField = ({
  content: ContentField,
  goBackToPage,
  field,
  form,
  pageHistory,
  pages,
  type,
  ...rest
}) => {
  const fields = Object.freeze({
    content: ContentField,
    custom: ContentField,
    repeatable: FormRepeatableField
  })

  const fieldProps = ['content', 'custom'].includes(type)
    ? { ...rest, ...form, goBackToPage, pageHistory, pages }
    : {
        ...rest,
        ...field,
        form,
        type,
        errorMessage: getErrorMessage({
          errors: form.errors,
          name: field.name,
          touched: form.touched
        })
      }
  
  const Field = fields.hasOwnProperty(type) ? fields[type] : FormikField
  return <Field {...fieldProps} />
}
