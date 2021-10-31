export type OrderSide = "buy" | "sell";

export type PlaceOrderFormProps = {
  readonly price: string;
  readonly amount: string;
  readonly total: string;
  readonly profits: Profit[];
};

export type Profit = {
  readonly profit: string;
  readonly target: string;
  readonly amount: string;
}
