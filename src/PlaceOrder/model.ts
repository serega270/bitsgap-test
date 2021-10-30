export type OrderSide = "buy" | "sell";

export type PlaceOrderFormProps = {
  readonly price: string;
  readonly amount: string;
  readonly total: string;
};
