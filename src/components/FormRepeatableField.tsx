import * as React from 'react'

interface Props {
  text: string
}

export const FormRepeatableField = ({ text }: Props) => {
  return <div>Repeatable Field Component: {text}</div>
}
