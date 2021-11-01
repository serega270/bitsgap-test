import * as yup from "yup";
import { MIN_PROFIT } from "./constants";
import ValidationError from "yup/lib/ValidationError";

export const PROFIT_STEP_MESSAGE =
  "Each target's profit should be greater than the previous one";
export const PROFIT_MAXIMUM_MESSAGE = "Maximum profit sum is 500%";

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

export const placeOrderFormSchema = yup.object({
  price: yup.number().positive().required(),
  amount: yup.number().positive().required(),
  total: yup.number().positive().required(),
  profits: yup.array().of(
    yup
      .object({
        profit: yup
          .number()
          .required()
          .min(MIN_PROFIT, `Minimum value is ${MIN_PROFIT}`),
        target_price: yup
          .number()
          .positive("Price must be greater than 0")
          .required(),
        amount: yup.number().positive("Must be greater than 0").required(),
      })
      .test("profit_greater", profitStepValidation)
      .test("profit_sum", profitMaximumValidation),
  ),
});
