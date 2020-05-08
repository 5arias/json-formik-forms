import * as React from 'react'
import { Field as FormikField, useField } from 'formik'
import { FormRepeatableField } from './FormRepeatableField'
import { getErrorMessage } from '../utilities'

const ContentField = () => <div>Content/Custom Field</div>

interface Props {
  type: string
}

/**
 * Need to get the following from the Form grandparent component, want to avoid
 * prop drilling through the FormPage component:
 * goBackToPage
 * pageHistory
 * pages
 */
export const FormField = ({ type, ...props }: Props) => {
  const [field, meta] = useField(props)

  // Should this be cached as a separate function and potentially memoized for performance?
  // This would allow the Field to take an optional prop where the dev can pass in their own
  // hash of components. makes it a bit more modular...I think. Not sure if elevating this
  // logic to the parent is the right way to go.
  const fields = Object.freeze({
    content: ContentField,
    custom: ContentField,
    repeatable: FormRepeatableField
  })
  /**
   * Abstract content/custom props into a separate component
   * ### EDIT: Think more about whether this should be abstracted. Custom/Content fields need
   * ### the `helpers` object from `useField` and `type` needs to be passed down to all fields.
   */
  // const fieldProps = ['content', 'custom'].includes(type)
  //   ? { ...rest, ...form, goBackToPage, pageHistory, pages }
  //   : {
  //       ...rest,
  //       ...field,
  //       form,
  //       type,
  //       errorMessage: getErrorMessage({
  //         errors: form.errors,
  //         name: field.name,
  //         touched: form.touched
  //       })
  //     }

  const Field = fields.hasOwnProperty(type) ? fields[type] : FormikField
  return <Field {...props} {...field} {...meta} />
}
