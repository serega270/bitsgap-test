export type OrderSide = "buy" | "sell";

export type PlaceOrderFormProps = {
  readonly price: number;
  readonly amount: number;
  readonly total: number;
  readonly profits: Profit[];
};

export type Profit = {
  readonly profit: number;
  readonly target: number;
  readonly amount: number;
}
