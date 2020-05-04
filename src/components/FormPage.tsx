import * as React from 'react'
import { conditionalFields } from '../utilities'
import { FormField } from './FormField'

// interface Props {
//   text: string
// }

// export const FormPage = ({ text }: Props) => {
//   return <div>Page Component: {text}</div>
// }

export class FormPage extends React.Component {
  static getDerivedStateFromProps = (props, state) => {
    const newState = {}
    if(props.fields != state.fields || props.values != state.values) {
      newState.fields = props.fields ? conditionalFields(props.fields, props.values) : null
      newState.values = props.values
    }
    return Object.keys(newState) > 0 ? newState : null
  }

  state = {
    fields: null
  }

  render() {
    const {
      className,
      description,
      hasFormTitle,
      title,
      goBackToPage,
      pageHistory,
      pages
    } = this.props

    const contentProps = {
      goBackToPage,
      pageHistory,
      pages
    }

    const { fields } = this.state
    const PageHeading = `h${hasFormTitle ? '2' : '1'}`

    return (
      <div className={className}>
        {title && <PageHeading>{title}</PageHeading>}
        {description && <p>{description}</p>}
        {fields && (
          fields.map((field, index) => {
            let key = (field.type === 'content') ? `content_${index}` : field.name
            return <Field component={FormField} key={key} {...contentProps} {...field} /> 
          })}
      </div>
    )
  }
}