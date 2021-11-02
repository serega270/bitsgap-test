/* eslint @typescript-eslint/no-use-before-define: 0 */

import React, { Fragment, useCallback, useEffect, useState } from "react";
import block from "bem-cn-lite";
import { AddCircle, Cancel } from "@material-ui/icons";
import { FieldValues, useFieldArray, useFormContext } from "react-hook-form";

import { TextButton, FormNumberInput, FormSwitch } from "components";

import { PROFIT_STEP, QUOTE_CURRENCY } from "../../constants";
import { OrderSide, Profit } from "../../model";
import "./TakeProfit.scss";

type Props = {
  orderSide: OrderSide;
};

type FormValues = FieldValues & {
  profits: Array<Profit>;
};

const b = block("take-profit");

const TakeProfit = ({ orderSide }: Props) => {
  const { fields, append, remove, update } = useFieldArray<
    FormValues,
    "profits"
  >({
    name: "profits",
  });
  const { watch, setValue, getValues } = useFormContext();
  const allWatch = watch();
  const priceWatch = watch("price");
  const profitsWatch = watch("profits");
  const withProfitWatch = watch("with_profit");
  const [projectedProfit, setProjectedProfit] = useState(0);

  useEffect(() => {
    if (fields?.length) {
      const values = getValues();
      const total = profitsWatch.reduce((acc: number, row: Profit) => {
        const value =
          orderSide === "buy"
            ? ((values.amount * row.amount) / 100) *
              (row.target_price - values.price)
            : ((values.amount * row.amount) / 100) *
              (values.price - row.target_price);

        return acc + value;
      }, 0);

      setProjectedProfit(total.toFixed(2));
    }
  }, [allWatch]);

  useEffect(() => {
    const amountTotal = fields.reduce((total: number, row) => {
      return total + (row.amount || 0);
    }, 0);
    if (amountTotal > 100) {
      const maxValue = Math.max.apply(
        Math,
        fields.map(function (o) {
          return o.amount;
        }),
      );
      const rowWithMaxAmountIndex = fields
        .map((i) => i.amount || 0)
        .indexOf(maxValue);

      const values = { ...fields[rowWithMaxAmountIndex] };

      update(rowWithMaxAmountIndex, {
        profit: values.profit,
        target_price: values.target_price,
        amount: 100 - amountTotal + maxValue,
      });
    }

    if (fields.length === 0) {
      setValue("with_profit", false);
    }
  }, [fields.length]);

  useEffect(() => {
    if (!withProfitWatch) {
      remove();
    }
    if (withProfitWatch) {
      append({
        profit: PROFIT_STEP,
        target_price:
          orderSide === "buy"
            ? priceWatch + (priceWatch * PROFIT_STEP) / 100
            : priceWatch - (priceWatch * PROFIT_STEP) / 100,
        amount: 100,
      });
    }
  }, [withProfitWatch]);

  useEffect(() => {
    fields.forEach((row, index) => {
      update(index, {
        ...profitsWatch[index],
        target_price:
          orderSide === "buy"
            ? priceWatch + (priceWatch * row.profit) / 100
            : priceWatch - (priceWatch * row.profit) / 100,
      });
    });
  }, [priceWatch, orderSide]);

  const addProfit = useCallback(() => {
    if (profitsWatch.length > 4) {
      return;
    }
    const prevValue = profitsWatch.length
      ? profitsWatch[profitsWatch.length - 1]
      : { profit: 0, target_price: 0, amount: 100 };

    const nextProfit = prevValue.profit + 2;
    append({
      profit: nextProfit,
      target_price:
        orderSide === "buy"
          ? priceWatch + (priceWatch * nextProfit) / 100
          : priceWatch - (priceWatch * nextProfit) / 100,
      amount: 20,
    });
  }, [profitsWatch, priceWatch]);

  const removeProfit = useCallback((index: number) => {
    remove(index);
  }, []);

  const onTargetPriceBlur = useCallback(
    (val: number | null, index: number) => {
      if (priceWatch === 0 || !val) {
        return;
      }
      const profit = (100 * (val - priceWatch)) / priceWatch;
      update(index, {
        ...profitsWatch[index],
        profit,
      });
    },
    [profitsWatch, priceWatch],
  );

  return (
    <div className={b()}>
      <div className={b("switch")}>
        <span>Take profit</span>
        <FormSwitch name="with_profit" />
      </div>
      {withProfitWatch && (
        <div className={b("content")}>
          {renderTitles()}
          {fields.map((field, index) => (
            <Fragment key={field.id}>{renderInputs(index)}</Fragment>
          ))}

          {fields.length < 5 && (
            <TextButton className={b("add-button")} onClick={addProfit}>
              <AddCircle className={b("add-icon")} />
              <span>Add profit target {fields.length}/5</span>
            </TextButton>
          )}

          <div className={b("projected-profit")}>
            <span className={b("projected-profit-title")}>
              Projected profit
            </span>
            <span className={b("projected-profit-value")}>
              <span aria-label="projected-profit">{projectedProfit}</span>
              <span className={b("projected-profit-currency")}>
                {QUOTE_CURRENCY}
              </span>
            </span>
          </div>
        </div>
      )}
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
          onBlur={(val) => onTargetPriceBlur(val, index)}
        />
        <FormNumberInput
          decimalScale={2}
          InputProps={{ endAdornment: "%" }}
          variant="underlined"
          name={`profits[${index}].amount`}
        />
        <div className={b("cancel-icon")}>
          <Cancel
            onClick={() => removeProfit(index)}
            aria-label="delete_profit"
          />
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
