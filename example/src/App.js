import React from 'react'

import { Form, FormField, FormPage, FormRepeatableField } from 'json-formik-forms'
import 'json-formik-forms/dist/index.css'

const App = () => {
  return (
    <>
      <Form text="Create React Library Example 😄" />
      <FormPage text="Create React Library Example 😄" />
      <FormField text="Create React Library Example 😄" />
      <FormRepeatableField text="Create React Library Example 😄" />
    </>
  )
}

export default App
