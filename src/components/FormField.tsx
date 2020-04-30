import * as React from 'react'

interface Props {
  text: string
}

export const FormField = ({ text }: Props) => {
  return <div>Field Component: {text}</div>
}
