import React, { useState } from 'react'
import { conditionalFields } from '../utilities'
import { FormField } from './FormField'
import { Field } from 'formik'

interface Props {
  className: string
  description: string
  fields: Array<object>
  hasFormTitle: boolean
  title: string
  values: object
}

// Placeholder for state management, haven't tested to see if this works at all. Probably needs a useEffect.
// Also might be able to handle the conditionalField function at the parent level instead.
// or go as far as to have parent pass the pageId instead and do all page calculations within this component.
export const FormPage = ({
  className,
  description,
  fields,
  hasFormTitle,
  title,
  values
}: Props) => {
  const [pageFields] = useState(conditionalFields(fields, values))
  const PageHeading = `h${hasFormTitle ? '2' : '1'}`
  return (
    <div className={className}>
      {title && <PageHeading>{title}</PageHeading>}
      {description && <p>{description}</p>}
      {pageFields &&
        pageFields.map((field: object, index: number) => (
          <Field
            component={FormField}
            key={field.name || `field_${index}`}
            {...field}
          />
        ))}
    </div>
  )
}

/**
 * This is the original code that I began refactoring to give an idea to everyone what's going on
 */
// export class FormPage extends React.Component {
//   static getDerivedStateFromProps = (props, state) => {
//     const newState = {}
//     if (props.fields != state.fields || props.values != state.values) {
//       newState.fields = props.fields
//         ? conditionalFields(props.fields, props.values)
//         : null
//       newState.values = props.values
//     }
//     return Object.keys(newState) > 0 ? newState : null
//   }

//   state = {
//     fields: null
//   }

//   render() {
//     const { className, description, hasFormTitle, title } = this.props

//     const { fields } = this.state
//     const PageHeading = `h${hasFormTitle ? '2' : '1'}`

//     return (
//       <div className={className}>
//         {title && <PageHeading>{title}</PageHeading>}
//         {description && <p>{description}</p>}
//         {fields &&
//           fields.map((field, index) => (
//             <Field
//               component={FormField}
//               key={field.name || `field_${index}`}
//               {...field}
//             />
//           ))}
//       </div>
//     )
//   }
// }
