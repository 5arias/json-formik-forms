import * as React from 'react'

interface Props {
  text: string
}

export const FormPage = ({ text }: Props) => {
  return <div>Page Component: {text}</div>
}
