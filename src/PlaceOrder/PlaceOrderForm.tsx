import React from "react";
import { observer } from "mobx-react";
import block from "bem-cn-lite";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";

import { Button, FormNumberInput } from "components";

import { BASE_CURRENCY, QUOTE_CURRENCY } from "./constants";
import { useStore } from "./context";
import { PlaceOrderTypeSwitch } from "./components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "./components/TakeProfit/TakeProfit";
import "./PlaceOrderForm.scss";
import useYup from "../components/hooks/yupValidationResolver";
import { PlaceOrderFormProps } from "./model";

const b = block("place-order-form");

export const placeOrderFormSchema = yup.object({
  price: yup.number().positive().required(),
  amount: yup.number().positive().required(),
  total: yup.number().positive().required(),
});

export const PlaceOrderForm = observer(() => {
  const { activeOrderSide, price, total, amount, setPrice, setAmount, setTotal, setOrderSide } =
    useStore();

  const form = useForm<PlaceOrderFormProps>({
    resolver: useYup(placeOrderFormSchema),
  });
  const { handleSubmit } = form;

  const onFormSubmit = (value: any) => {
    debugger;
  };

  const onFormError = (errors: any) => {
    console.log("onError", errors);
  };

  return (
    <FormProvider {...form}>
      <form className={b()} onSubmit={handleSubmit(onFormSubmit, onFormError)}>
        <div className={b("header")}>Binance: {`${BASE_CURRENCY} / ${QUOTE_CURRENCY}`}</div>
        <div className={b("type-switch")}>
          <PlaceOrderTypeSwitch activeOrderSide={activeOrderSide} onChange={setOrderSide} />
        </div>
        <div className={b("price")}>
          <FormNumberInput
            label="Price"
            value={price}
            InputProps={{ endAdornment: QUOTE_CURRENCY }}
            name="price"
          />
        </div>
        <div className={b("amount")}>
          <FormNumberInput
            value={amount}
            label="Amount"
            InputProps={{ endAdornment: BASE_CURRENCY }}
            name="amount"
          />
        </div>
        <div className={b("total")}>
          <FormNumberInput
            value={total}
            label="Total"
            InputProps={{ endAdornment: QUOTE_CURRENCY }}
            name="total"
          />
        </div>
        <div className={b("take-profit")}>
          <TakeProfit orderSide={activeOrderSide} />
        </div>
        <div className="submit">
          <Button color={activeOrderSide === "buy" ? "green" : "red"} type="submit" fullWidth>
            {activeOrderSide === "buy" ? `Buy ${BASE_CURRENCY}` : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
});
