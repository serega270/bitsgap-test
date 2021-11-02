import React from "react";
import { observer } from "mobx-react";
import block from "bem-cn-lite";
import { useForm, FormProvider } from "react-hook-form";

import { Button, FormNumberInput } from "components";

import { BASE_CURRENCY, QUOTE_CURRENCY } from "./constants";
import { useStore } from "./context";
import { PlaceOrderTypeSwitch } from "./components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "./components/TakeProfit/TakeProfit";
import "./PlaceOrderForm.scss";
import useYup from "../components/hooks/yupValidationResolver";
import { PlaceOrderFormProps } from "./model";
import { placeOrderFormSchema } from "./validation";

const b = block("place-order-form");

export const PlaceOrderForm = observer(() => {
  const { activeOrderSide, setOrderSide } = useStore();

  const form = useForm<PlaceOrderFormProps>({
    resolver: useYup(placeOrderFormSchema),
    defaultValues: {
      price: 0,
      amount: 0,
      total: 0,
    },
  });
  const { handleSubmit, setValue, getValues } = form;

  const onFormSubmit = (value: PlaceOrderFormProps) => {
    console.log("Form value", value);
  };

  const onFormError = (errors: any) => {
    console.log("Place order form validation", errors);
  };

  const totalUpdate = () => {
    const values = getValues();
    setValue("total", (values.amount || 0) * (values.price || 0));
  };

  const onTotalChange = () => {
    const values = getValues();
    setValue("amount", values.price > 0 ? values.total / values.price : 0);
  };

  return (
    <FormProvider {...form}>
      <form className={b()} onSubmit={handleSubmit(onFormSubmit, onFormError)}>
        <div className={b("header")}>
          Binance: {`${BASE_CURRENCY} / ${QUOTE_CURRENCY}`}
        </div>
        <div className={b("type-switch")}>
          <PlaceOrderTypeSwitch
            activeOrderSide={activeOrderSide}
            onChange={setOrderSide}
          />
        </div>
        <div className={b("price")}>
          <FormNumberInput
            label="Price"
            InputProps={{ endAdornment: QUOTE_CURRENCY }}
            name="price"
            onChange={totalUpdate}
          />
        </div>
        <div className={b("amount")}>
          <FormNumberInput
            label="Amount"
            InputProps={{ endAdornment: BASE_CURRENCY }}
            name="amount"
            onChange={totalUpdate}
          />
        </div>
        <div className={b("total")}>
          <FormNumberInput
            label="Total"
            InputProps={{ endAdornment: QUOTE_CURRENCY }}
            name="total"
            onChange={onTotalChange}
          />
        </div>
        <div className={b("take-profit")}>
          <TakeProfit orderSide={activeOrderSide} />
        </div>
        <div className="submit">
          <Button
            color={activeOrderSide === "buy" ? "green" : "red"}
            type="submit"
            fullWidth
          >
            {activeOrderSide === "buy"
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
});
