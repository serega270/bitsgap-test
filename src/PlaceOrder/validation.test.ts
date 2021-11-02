import {placeOrderFormSchema, PROFIT_MAXIMUM_MESSAGE, PROFIT_STEP_MESSAGE} from "./validation";

describe("PlaceOrder validation", () => {
  it("max profit validation", async () => {
    const result = await placeOrderFormSchema
      .validateAt("profits", {
        profits: [{ profit: 50 }, { profit: 500 }, { profit: 60 }],
      })
      .catch((err) => err);

    expect(result.errors).toEqual([PROFIT_MAXIMUM_MESSAGE]);
  });

  it("profit should be greater than the previous one", async () => {
    const result = await placeOrderFormSchema
      .validateAt("profits", {
        profits: [{ profit: 2 }, { profit: 4 }, { profit: 3 }],
      })
      .catch((err) => err);

    expect(result.errors).toEqual([PROFIT_STEP_MESSAGE]);
    expect(result.path).toEqual('profits[2].profit');
  });

  it("profitAmountMaximumValidation. invalid case", async () => {
    const result = await placeOrderFormSchema
      .validateAt("profits", {
        profits: [{ amount: 80 }, { amount: 30 }],
      })
      .catch((err) => err);

    expect(result.type).toEqual('profit_amount_sum');
  });
});
