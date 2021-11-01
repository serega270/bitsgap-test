import * as yup from "yup";
import { MIN_PROFIT } from "./constants";
import ValidationError from "yup/lib/ValidationError";

export const PROFIT_STEP_MESSAGE =
  "Each target's profit should be greater than the previous one";
export const PROFIT_MAXIMUM_MESSAGE = "Maximum profit sum is 500%";
export const POSITIVE_MESSAGE = "Must be greater than 0";
export const TYPE_ERROR_MESSAGE = "Invalid value";

/**
 * Check that the next step is more profitable than the previous one
 * @param row
 * @param context
 */
const profitStepValidation = (
  row: any,
  context: any,
): ValidationError | boolean => {
  const currIndex = context.options.index;
  if (currIndex === 0) {
    return true;
  }
  const prevRow = context.parent[currIndex - 1];

  return row.profit < prevRow.profit
    ? context.createError({
        message: PROFIT_STEP_MESSAGE,
        path: `profits[${currIndex}].profit`,
      })
    : true;
};

/**
 * Check that the profit percentage is less than 500%
 * @param row
 * @param context
 */
const profitMaximumValidation = (
  row: any,
  context: any,
): ValidationError | boolean => {
  const rows = context.parent;
  const currIndex = context.options.index;
  const total = rows.reduce((total: number, row: any) => {
    return total + (row.profit || 0);
  }, 0);

  return total > 500
    ? context.createError({
        message: PROFIT_MAXIMUM_MESSAGE,
        path: `profits[${currIndex}].profit`,
      })
    : true;
};

/**
 * Check that less than 100 percent of the total amount is spent
 * @param row
 * @param context
 */
const profitAmountMaximumValidation = (
  row: any,
  context: any,
): ValidationError | boolean => {
  const rows = context.parent;
  const currIndex = context.options.index;
  const total = rows.reduce((total: number, row: any) => {
    return total + (row.amount || 0);
  }, 0);

  return total > 100
    ? context.createError({
        message: `${total} out of 100% selected.
         Please decrease by ${total - 100}`,
        path: `profits[${currIndex}].amount`,
      })
    : true;
};

export const placeOrderFormSchema = yup.object({
  price: yup
    .number()
    .typeError(TYPE_ERROR_MESSAGE)
    .positive(POSITIVE_MESSAGE)
    .required(),
  amount: yup
    .number()
    .typeError(TYPE_ERROR_MESSAGE)
    .positive(POSITIVE_MESSAGE)
    .required(),
  total: yup
    .number()
    .typeError(TYPE_ERROR_MESSAGE)
    .positive(POSITIVE_MESSAGE)
    .required(),
  profits: yup.array().of(
    yup
      .object({
        profit: yup
          .number()
          .typeError(TYPE_ERROR_MESSAGE)
          .required()
          .min(MIN_PROFIT, `Minimum value is ${MIN_PROFIT}`),
        target_price: yup
          .number()
          .typeError(TYPE_ERROR_MESSAGE)
          .positive("Price must be greater than 0")
          .required(),
        amount: yup
          .number()
          .typeError(TYPE_ERROR_MESSAGE)
          .positive(POSITIVE_MESSAGE)
          .required(),
      })
      .test("profit_greater", profitStepValidation)
      .test("profit_sum", profitMaximumValidation)
      .test("profit_amount_sum", profitAmountMaximumValidation),
  ),
});
