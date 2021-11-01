import React from "react";
import { render, screen } from "@testing-library/react";
import { PlaceOrderForm } from "./PlaceOrderForm";
import { clearAndTypeTextBox } from "../test-helpers/clearAndTypeTextBox";

describe("PlaceOrderForm", () => {
  it("should render form with default values", async () => {
    render(<PlaceOrderForm />);

    const priceInput = (await screen.getByRole("textbox", {
      name: /price/i,
    })) as HTMLInputElement;
    expect(priceInput.value).toEqual("0");

    const amountInput = (await screen.getByRole("textbox", {
      name: /amount/i,
    })) as HTMLInputElement;
    expect(amountInput.value).toEqual("0");

    const totalInput = (await screen.getByRole("textbox", {
      name: /total/i,
    })) as HTMLInputElement;
    expect(totalInput.value).toEqual("0");
  });

  it("should calculate total", async () => {
    render(<PlaceOrderForm />);

    await clearAndTypeTextBox("price", "1000");
    await clearAndTypeTextBox("amount", "500");

    const totalInput = (await screen.getByRole("textbox", {
      name: /total/i,
    })) as HTMLInputElement;
    expect(totalInput.value).toEqual("500000");

    await clearAndTypeTextBox("price", "0");
    expect(totalInput.value).toEqual("0");
  });

  it("should calculate amount", async () => {
    render(<PlaceOrderForm />);

    await clearAndTypeTextBox("price", "1000");
    await clearAndTypeTextBox("total", "500000");

    const amountInput = (await screen.getByRole("textbox", {
      name: /amount/i,
    })) as HTMLInputElement;
    expect(amountInput.value).toEqual("500");

    await clearAndTypeTextBox("total", "0");
    expect(amountInput.value).toEqual("0");
  });
});
