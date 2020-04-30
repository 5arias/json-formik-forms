import * as React from 'react'

interface Props {
  text: string
}

export const Form = ({ text }: Props) => {
  return <div>Form Component: {text}</div>
}
