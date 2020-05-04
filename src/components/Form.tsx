import * as React from 'react'
import {
  getInitialValues,
  resolveValueOrFunction,
  sanitizeValues
} from '../utilities'
import { Formik } from 'formik'
import { FormPage } from './FormPage'
import { last } from 'lodash'

// interface Props {
//   text: string
// }

// export const Form = ({ text }: Props) => {
//   return <div>Form Component: {text}</div>
// }

export class Form extends React.Component {
  state = {
    pageHistory: [0],
    pageCount: this.props.schema.pages.length,
    values: getInitialValues(props.schema.pages)
  }

  next = (values) => {
    const page = last(this.state.pageHistory)
    const currentPageSchema = this.props.schema.pages[page]
    const { action } = currentPageSchema
    let nextPage = Math.min(page + 1, this.state.pageCount - 1)

    if (action) {
      switch (action.type) {
        case undefined:
        case NEXT:
          break
        case GOTO:
          const pageId = resolveValueOrFunction(action.pageId, values)
          nextPage = this.props.schema.pages.findIndex((p) => p.id === pageId)
          if (pageId === -1) {
            throw new Error(`Page action pageId, ${pageId}, not found`)
          }
          break
        default:
          throw new Error(`Page action type, ${action.type}, is not valid`)
      }
    }
    this.setState(
      (state) => ({
        pageHistory: [...state.pageHistory, nextPage],
        values
      }),
      () => {
        this.props.onPageChange(nextPage)
        this.resetFormFocus()
      }
    )
  }

  handlePrevious = () => {
    this.setState(
      (state) => ({
        pageHistory: state.pageHistory.slice(0, -1)
      }),
      () => {
        this.props.onPageChange(last(this.state.pageHistory))
        this.resetFormFocus()
      }
    )
  }

  resetFormFocus = () => {
    const form = document.getElementById(this.props.id)
    if (form) {
      form.focus()
      form.scrollIntoView()
    }
  }

  setValidationProp = (activePage) =>
    activePage.validation ? { validationSchema: activePage.validation } : {}

  handleSubmit = (values, formikBag) => {
    const { onSubmit, pages } = this.props.schema
    const { pageHistory, pageCount } = this.state
    const isLastPage = last(pageHistory) === pageCount - 1
    if (isLastPage) {
      const validPages = pageHistory.map((i) => pages[i])
      return onSubmit(sanitizeValues(validPages, values), formikBag)
    } else {
      this.next(values)
      formikBag.setTouched({})
      formikBag.setSubmitting(false)
    }
  }

  goBackToPage = (pageId) => {
    const pageIndex = this.props.schema.pages.findIndex((p) => p.id === pageId)
    const historyIndex = this.state.pageHistory.indexOf(pageIndex)
    this.setState(
      { pageHistory: this.state.pageHistory.slice(0, historyIndex + 1) },
      () => {
        this.props.onPageChange(last(this.state.pageHistory))
        this.resetFormFocus()
      }
    )
  }

  render() {
    const { schema } = this.props
    const { pageHistory, pageCount, values } = this.state
    const page = last(pageHistory)
    const isLastPage = page === pageCount - 1
    const currentPageSchema = schema.pages[page]
    const validation = this.setValidationProp(currentPageSchema)

    return (
      <Formik
        {...validation}
        initialValues={values}
        onSubmit={this.handleSubmit}
        render={({ handleSubmit, isSubmitting, ...form }) => (
          <form
            onSubmit={handleSubmit}
            className={schema.className}
            id={this.props.id}
            aria-live='polite'
            tabIndex={0}
          >
            {schema.formTitle && (
              <h1 className='form-title'>{schema.formTitle}</h1>
            )}
            <FormPage
              pages={schema.pages}
              pageHistory={pageHistory}
              goBacktoPage={this.goBackToPage}
              isSubmitting={isSubmitting}
              hasFormTitle={!!schema.formTitle}
              {...currentPageSchema}
              {...form}
            />
            {this.props.children}
            <div className='action-buttons'>
              {!currentPageSchema?.action.hideButton && (
                <button type='submit' disabled={isSubmitting}>
                  {currentPageSchema?.action.buttonText ||
                    (isLastPage ? 'Submit' : 'Continue')}
                </button>
              )}
              {page > 0 && <button onClick={this.handlePrevious}>Back</button>}
            </div>
          </form>
        )}
      />
    )
  }
}
