# json-formik-forms

> Create complex forms via JSON using your design system and/or UI library

[![NPM](https://img.shields.io/npm/v/json-formik-forms.svg)](https://www.npmjs.com/package/json-formik-forms) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Why not JSON Schema, ReduxForm, or plain old Formik?
Design Systems and UI libraries include form components, so why should you spend time jamming them in as "custom fields" or styling built in fields? Our philosophy is simple: generate forms via a JSON schema that seamlessly integrates the form components of your choosing and intuitively reflects props objects for those components. 

The JSON Schema specification is very powerful and meant to be universal across language implementations - which is great but not always for forms. In React, the spec becomes increasingly difficult to read at a human level as a form scales, and the separation of UI vs Form schema directly contradicts the `props` pattern for React components. 


## Install

```bash
npm install --save json-formik-forms
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from 'json-formik-forms'
import 'json-formik-forms/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## Features
- [Schema](#schema)
- [Branching](#branching)
- [Conditional Fields](#conditional-fields)
- [Content & Custom Fields](#content-&-custom-fields)
- [Dynamic Checkbox/Radio/Select Choices](#dynamic-checkbox/radio/select-choices)
- [Repeatable Fields & Field Sets](#repeatable-fields-&-field-sets)


### Schema
The `Form` component provides a simple standardized way to create single and
multi-page web forms using only a JSON schema.

Form pages consist of an `id`, `title` (optional), `description` (optional),
and an array of field objects.

Fields use the field components in this design system and are declared via the
`type` key in each field object. Fields support all props listed within that
component's documentation - including required props. The following fields
are currently supported:

- `content`
- `custom`
- `checkbox`
- `radio`
- `repeatable`
- `select`
- `text`
- All other valid HTML input types will be rendered by the Field component.

### Branching
The `Form` component supports logic for navigating to specific form pages;
including conditional navigation based on form field answers. By default, the
form will navigate sequentially through the `pages` array. Branching is defined
by adding the optional `action` object to a `page` object.

#### Page `action` object
```
pages: [
  {
    id: 'page_1',
    action: {
      type: 'goto',
      pageId: 'another_page_id' || (values) => {
        if(values.field_1 === 'A') {
          return 'page_3'
        } else {
          return 'page_2'
        }
      },
      buttonText: 'Custom continue button text'
    }
  }
]
```

- `type`: options are*goto** and*next**(default).
  -*goto** requires the*page_id** to be defined
  -*next** is set as the default for sequential page direction.
- `pageId`: accepts either a*string** or*function**.
  - The string must be a valid page object id in the form schema, invalid Ids
will throw an error.
  - The function receives a form values object as its sole parameter and
expects a string (**page_id**) to be returned. It should be used to resolve
conditional branching logic based on the page field values.
- `buttonText`: optional string for custom text applied to the "continue" or
"submit" button

### Conditional Fields
The `Form` component provides a simple way to define additional fields that
will be conditionally displayed based on user selected values.
For example: a radio field has a choice of `Other`, and when the user selects
`Other` a new text field is displayed for the user to enter the custom value.

Negative conditions (`not`) are supported where a field should not be displayed if the parent
value matches the designated value(s). Negation supercedes `value` conditions such that a field
will not be displayed if the parent value matches both a `value` and `not` condition.

`value = 'any'` is supported where you want to display a conditional field once the parent field
has any valid field value (i.e. not an empty string or array.)

Each field defined in the JSON `fields` array has an optional attribute named
`conditionals`. It has three attributes:

- fields: array of field objects to display for the condition.
- not: string or array of strings
- value: string or array of strings

```
type: 'radio',
choices: [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'Other', value: 'Other' }
],
name: 'select_1',
conditionals: [
  {
    value: 'Other',
    not: 'C',
    fields: [
      {
        type: 'text',
        label: 'Enter other value',
        name: 'select_1_other'
      }
    ]
  }
```


### Content & Custom Fields
The `Form` component supports `content` and `custom` field types which accept a
Component function to be rendered. They are provided the all formik props and actions, in
addition to internal form values.

Content fields are removed from the form value set and automatic review page. Use the `custom`
field type for custom input components.

- `goBackToPage` - function to return to a form page in the pageHistory.
  -*parameter**: integer
- `pageHistory` - array of page indexes (integers) that have been visited in the form.
- `pages` - array of page objects provided in the form schema.
- [https://jaredpalmer.com/formik/docs/api/formik](https://jaredpalmer.com/formik/docs/api/formik)

### Dynamic Checkbox/Radio/Select Choices
Checkbox, Radio, and Select field types allow for their choice options to dynamically update
based on the string value of a single parent field. Dynamic choice options are defined by two
objects. The first object accepts two parameters:

- parentField: `string`
- choices: `object`

The second, nested `choices` object is a key/value pair:
- key: `string` value which matches parent field value
- value: `array` of choice objects to display

```
{
  type: 'select',
  name: 'dynamic_choice_field',
  choices: {
    parentField: 'sample_parent_field',
    choices: {
      orange: [
        { label: 'Tangerine', value: 'tangerine'},
        { label: 'Clementine', value: 'clementine' },
        { label: 'Navel', value: 'navel' }
      ],
      apple: [
        { label: 'Honeycrisp', value: 'honeycrisp' },
        { label: 'McIntosh', value: 'mcintosh' },
        { label: 'Ambrosia', value: 'ambrosia' },
        { label: 'Empire', checked: true, value: 'empire' },
        { label: 'Granny Smith', value: 'granny_smith' }
      ],
      lemon: [
        { label: 'Meyer', checked: true, value: 'meyer' },
        { label: 'Ponderosa', value: 'ponderosa' }
      ]
    }
  }
}
```

### Repeatable Fields & Field Sets
The `Form` component supports a `repeatable` field type which accepts and array of field objects
to define a field group. This helps the user with common array/list manipulations, such as "add
another address or person".

The field returns an array of key/value objects for each field group the user adds.

#### Required Props
- `fields` - array of field objects
- `label` - string
- `name` - string

#### Additional Props
- `addButton` - props object to customize the add button. Supports a `text` property to replace the default `+` and all other props will be passed to the `Button` component
- `className` - Additional classes to be added to the root `div` element
- `deleteButton` - props object to customize the delete button for all field groups. Supports a `text` property to replace the default `-` and all other props will be passed to the `Button` component
- `hint` - Additional hint text to display
- `labelClassName` - Additional classes to be added to the label
- `max` - maximum number of field groups allowed
- `requirementLabel` - Text showing the requirement ("Required", "Optional", etc.).

```
{
 type: 'repeatable',
 label: 'This is a repeatable set of fields',
 name: 'repeat_all_the_fields',
 fields: [
   {
     type: 'text',
     name: 'repeat_input',
     label: 'Repeat Input'
   }
 ]
}
```

## License

MIT © [5arias](https://github.com/5arias)
