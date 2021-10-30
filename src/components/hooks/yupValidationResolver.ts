import { useCallback } from 'react'
import { SchemaOf } from 'yup'

// The original source is here https://react-hook-form.com/advanced-usage/#CustomHookwithResolver
const useYup = (validationSchema: SchemaOf<any>): ((...args: any[]) => any) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        })

        return {
          values,
          errors: {},
        }
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        }
      }
    },
    [validationSchema],
  )

export default useYup
