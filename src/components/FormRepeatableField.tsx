import * as React from 'react'
import { getFieldValueHash, getErrorMessage, conditionalFields } from '../utilities'
import { FormField } from './FormField'

// interface Props {
//   text: string
// }

// export const FormRepeatableField = ({ text }: Props) => {
//   return <div>Repeatable Field Component: {text}</div>
// }

export const FormRepeatableField = ({
  addButton,
  className,
  deleteButton,
  fields,
  form,
  label,
  labelClassName,
  max,
  name,
  value
}) => {
  const addButtonText = addButton.text || '+'
  const deleteButtonText = deleteButton.text || '-'

  const defaultFieldValues = getFieldValueHash(fields)
  const fieldArrayError = typeof form.errors[name] === 'string' && getErrorMessage({ errors: form.errors, name, touched: form.touched})

  return (
    <FieldArray 
      name={name}
      render={ arrayHelpers => (
        <div className={className}>
          <label className={labelClassName}>{label}</label>
          {fieldArrayError && <span>{fieldArrayError}</span>}
          {value.map((val, index) => {
            const allFields = conditionalFields(fields, val)
            return (
              <div key={`repeatable_fieldset_${index}`}>
                {allFields.map(f => {
                  const key = `${name}.${index}.${f.name}`
                  if (['checkbox', 'radio'].includes(f.type)) {
                    f.value = val[f.name]
                  }
                  return (
                    <Field component={FormField} {...f} key={key} name={key} />
                  )
                })}
              </div>
            )
          })}
          {
            !(index === 0) && (<button {...deleteButton} onClick={()=>arrayHelpers.remove(index)}>{deleteButtonText}</button>)
          }
          {
            !(max && value.length === max) && (
            <button
              {...addButton}
              onClick={() => arrayHelpers.push(defaultFieldValues)}
            >
              {addButtonText}
            </button>
            )
          }
        </div>
      )
    />
  )
}
