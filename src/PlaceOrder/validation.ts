import * as yup from "yup";

export const placeOrderFormSchema = yup.object({
  price: yup.number().positive().required(),
  amount: yup.number().positive().required(),
  total: yup.number().positive().required(),
  profits: yup
    .array()
    .of(
      yup
        .object({
          profit: yup
            .number()
            .positive()
            .required()
            .min(0.01, "Minimum value is 0.01"),
          target_price: yup
            .number()
            .positive("Price must be greater than 0")
            .required(),
          amount: yup.number().positive().required(),
        })
        .test(
          "profit_greater",
          "Each target's profit should be greater than the previous one",
          function (row: any, context: any) {
            const currIndex = context.options.index;
            if (currIndex === 0) {
              return true;
            }
            const prevRow = context.parent[currIndex - 1];

            return row.profit < prevRow.profit
              ? this.createError({
                  message:
                    "Each target's profit should be greater than the previous one",
                  path: `profits[${currIndex}].profit`,
                })
              : true;
          },
        ),
    )
    .test(
      "profit_sum",
      "The total number of elements must match the total.",
      function (rows = [] as any) {
        const total = rows.reduce((total: number, row: any) => {
          return total + (row.profit || 0);
        }, 0);

        return total > 500
          ? this.createError({
              message: "Maximum profit sum is 500%",
              path: "profits[0].profit",
            })
          : true;
      },
    ),
});
