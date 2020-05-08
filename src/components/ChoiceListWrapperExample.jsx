// THIS IS HERE TO PROVIDE AN EXAMPLE FOR IMPLEMENTING DYNAMIC CHOICE FUNCTIONALITY
// IDEALLY THIS FUNCTIONALITY SHOULD BE ABSTRACTED INTO A SEPARATE FUNCTION OR HOOK


import ChoiceList from '../../ChoiceList/ChoiceList'
import PropTypes from 'prop-types'
import React from 'react'
import { isObject } from '../utils/isObject'
class ChoiceListWrapper extends React.Component {
  /*
   * Formik currently has a bug that prevents checkboxes and radios from properly binding the
   * "value" prop, which means an initialValue is incorrectly undefined. As a work around, we need
   * to pull the field value directly from parent form state
   *
   * A fix has been merged in v2 which is awaiting release
   * https://github.com/jaredpalmer/formik/pull/1555
   */
  static getDerivedStateFromProps(props) {
    const { form, name, type, value } = props
    const formikValue = value || form.values[name]
    return {
      value: type === 'checkbox' ? formikValue || [] : formikValue
    }
  }
  state = {
    value: ''
  }
  /**
   * Resets dynamic choice option value in Form state on mount
   *
   * Every time a dynamic choice option field mounts, the Form state value must be updated with a
   * default value from the current choice set.
   */
  componentDidMount() {
    const { choices, form } = this.props
    if (this._hasDynamicChoices(choices)) {
      this._setDynamicChoiceFieldValue(form.values[choices.parentField])
    }
  }
  /**
   * Resets dynamic choice option value in Form state on component update or re-render
   *
   * Every time a dynamic choice option field updates and re-renders, the Form state value must be
   * updated with a default value from the updated choice set.
   */
  componentDidUpdate(prevProps) {
    const { choices, form } = this.props
    if (this._hasDynamicChoices(choices)) {
      const newParentVal = form.values[choices.parentField]
      const prevParentVal = prevProps.form.values[choices.parentField]
      if (newParentVal !== prevParentVal) {
        this._setDynamicChoiceFieldValue(newParentVal)
      }
    }
  }
  /**
   * Determine if any value(s) have `checked:true`
   *
   * checkbox returns an array of checked values or empty array
   * radio/select returns checked value or value of first choice option
   */
  _getDynamicChoiceDefaultValue = (choices, type = '') => {
    const checkedItems = choices.filter((item) => item.checked === true)
    return type === 'checkbox'
      ? checkedItems.map((item) => item.value)
      : checkedItems.length === 0
      ? choices[0].value
      : checkedItems[0].value
  }
  _getDynamicChoiceOptions = ({ parentField, choices }) => {
    const { form } = this.props
    const parentValue = form.values[parentField]
    return parentValue && parentValue.length > 0 ? choices[parentValue] : []
  }
  _handleCheckboxChange = (e) => {
    const { form, name } = this.props
    const newValue = e.target.checked
      ? this.state.value.concat([e.target.value]).sort()
      : this.state.value.filter((v) => v !== e.target.value).sort()
    return form.setFieldValue(name, newValue)
  }
  _hasDynamicChoices = (choices) =>
    isObject(choices) &&
    choices.parentField != null &&
    Object.keys(choices.choices).length > 0
  /**
   * Updates formik state with the default value for the choice set if the current value is not
   * included in the set.
   */
  _setDynamicChoiceFieldValue = (parentFieldValue) => {
    const { choices, name, form, type, value } = this.props
    const choiceSet = choices.choices[parentFieldValue]
    const validValues = choiceSet.map((set) => set.value)
    if (value === '' || !validValues.includes(value)) {
      const defaultValue = this._getDynamicChoiceDefaultValue(choiceSet, type)
      form.setFieldValue(name, defaultValue)
    }
  }
  render() {
    const { choices, form, onChange, type, ...rest } = this.props
    const onChoiceChange =
      type === 'checkbox' ? this._handleCheckboxChange : onChange
    /*
     * Dynamic Choice Options
     */
    const choiceOptions = this._hasDynamicChoices(choices)
      ? this._getDynamicChoiceOptions(choices)
      : choices
    return (
      <ChoiceList
        {...rest}
        choices={choiceOptions}
        onChange={onChoiceChange}
        type={type}
        value={this.state.value}
        selectedValue={this.state.value}
      />
    )
  }
}
ChoiceListWrapper.propTypes = {
  choices: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Object)]),
  name: PropTypes.string,
  form: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
}
export default ChoiceListWrapper
