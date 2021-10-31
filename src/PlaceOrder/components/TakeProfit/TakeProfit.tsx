/* eslint @typescript-eslint/no-use-before-define: 0 */

import React, { Fragment } from "react";
import block from "bem-cn-lite";
import { AddCircle, Cancel } from "@material-ui/icons";

import { Switch, TextButton, FormNumberInput } from "components";

import { QUOTE_CURRENCY } from "../../constants";
import { OrderSide } from "../../model";
import "./TakeProfit.scss";
import { useFieldArray, useFormContext } from "react-hook-form";

type Props = {
  orderSide: OrderSide;
  // ...
};

const b = block("take-profit");

const TakeProfit = ({ orderSide }: Props) => {
  const { fields, append, remove } = useFieldArray(
    {
      name: "profits",
    },
  );
  const { watch } = useFormContext();
  const profitsWatch = watch("profits");

  const addProfit = (data: any) => {
    if (profitsWatch.length > 4) {
      return;
    }
    const prevValue = profitsWatch.length
      ? profitsWatch[profitsWatch.length - 1]
      : { profit: 0, target_price: 0, amount: 100 };

    append({ profit: prevValue.profit + 2, target_price: prevValue.target_price, amount: "" });
  };

  const removeProfit = (index: number) => {
    remove(index);
  };

  return (
    <div className={b()}>
      <div className={b("switch")}>
        <span>Take profit</span>
        <Switch checked />
      </div>
      <div className={b("content")}>
        {renderTitles()}
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            {renderInputs(index)}
          </Fragment>
        ))}

        {fields.length < 5 && (
          <TextButton
            className={b("add-button")}
            onClick={() => addProfit(fields)}
          >
            <AddCircle className={b("add-icon")} />
            <span>Add profit target {fields.length}/5</span>
          </TextButton>
        )}

        <div className={b("projected-profit")}>
          <span className={b("projected-profit-title")}>Projected profit</span>
          <span className={b("projected-profit-value")}>
            <span>0</span>
            <span className={b("projected-profit-currency")}>
              {QUOTE_CURRENCY}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
  function renderInputs(index: number) {
    return (
      <div className={b("inputs")}>
        <FormNumberInput
          decimalScale={2}
          InputProps={{ endAdornment: "%" }}
          variant="underlined"
          name={`profits[${index}].profit`}
        />
        <FormNumberInput
          decimalScale={2}
          InputProps={{ endAdornment: QUOTE_CURRENCY }}
          variant="underlined"
          name={`profits[${index}].target_price`}
        />
        <FormNumberInput
          decimalScale={2}
          InputProps={{ endAdornment: "%" }}
          variant="underlined"
          name={`profits[${index}].amount`}
        />
        <div className={b("cancel-icon")}>
          <Cancel onClick={() => removeProfit(index)} />
        </div>
      </div>
    );
  }

  function renderTitles() {
    return (
      <div className={b("titles")}>
        <span>Profit</span>
        <span>Target price</span>
        <span>Amount to {orderSide === "buy" ? "sell" : "buy"}</span>
      </div>
    );
  }
};

export { TakeProfit };
