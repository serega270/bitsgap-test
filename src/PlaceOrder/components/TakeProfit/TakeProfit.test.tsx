import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithReactHookForm } from "../../../test-helpers/renderWithReactHookForm";
import { TakeProfit } from "./TakeProfit";
import userEvent from "@testing-library/user-event";
import { clearAndTypeTextBox } from "../../../test-helpers/clearAndTypeTextBox";

let output = {};

describe("TakeProfit", () => {
  it("should change checkbox and render default row", async () => {
    renderWithReactHookForm(<TakeProfit orderSide="buy" />, {
      onSubmit: (e) => {
        output = e;
      },
    });

    userEvent.click(screen.getByRole("checkbox"));

    expect(
      screen.getByRole("textbox", { name: "profits[0].profit" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "profits[0].amount" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "profits[0].target_price" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add profit target 1\/5/i }),
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "submit" }));
    await waitFor(() =>
      expect(output).toMatchObject({
        profits: [
          {
            amount: 100,
            profit: 2,
            target_price: 0,
          },
        ],
        with_profit: true,
      }),
    );
  });

  it("should decrease the largest value of amount if total > 100%", async () => {
    renderWithReactHookForm(<TakeProfit orderSide="buy" />, {
      defaultValues: {
        with_profit: true,
      },
      onSubmit: (e) => {
        output = e;
      },
    });

    await waitFor(() => userEvent.click(screen.getByRole("checkbox")));
    const addProfitButton = screen.getByRole("button", {
      name: /Add profit target/i,
    });

    userEvent.click(addProfitButton);
    userEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() =>
      expect(output).toMatchObject({
        profits: [
          {
            amount: 80,
          },
          {
            amount: 20,
          },
        ],
      }),
    );

    userEvent.click(addProfitButton);
    userEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() =>
      expect(output).toMatchObject({
        profits: [
          {
            amount: 60,
          },
          {
            amount: 20,
          },
          {
            amount: 20,
          },
        ],
      }),
    );

    await clearAndTypeTextBox("profits[1].amount", "50");
    userEvent.click(addProfitButton);
    userEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() =>
      expect(output).toMatchObject({
        profits: [
          {
            amount: 10,
          },
          {
            amount: 50,
          },
          {
            amount: 20,
          },
          {
            amount: 20,
          },
        ],
      }),
    );
  });

  it("max count of profit row is 5", async () => {
    const { container } = renderWithReactHookForm(
      <TakeProfit orderSide="buy" />,
      {
        onSubmit: (e) => {
          output = e;
        },
      },
    );

    await waitFor(() => userEvent.click(screen.getByRole("checkbox")));
    const addProfitButton = screen.getByRole("button", {
      name: /Add profit target/i,
    });
    userEvent.click(addProfitButton);
    userEvent.click(addProfitButton);
    userEvent.click(addProfitButton);
    expect(addProfitButton).toBeInTheDocument();

    userEvent.click(addProfitButton);
    expect(addProfitButton).not.toBeInTheDocument();
    // expect(addProfitButton).toHaveClass.toBeInTheDocument()

    expect(container.getElementsByClassName("take-profit__inputs").length).toBe(
      5,
    );
  });

  it("should remove profit row", async () => {
    const { container } = renderWithReactHookForm(
      <TakeProfit orderSide="buy" />,
      {
        onSubmit: (e) => {
          output = e;
        },
      },
    );

    await waitFor(() => userEvent.click(screen.getByRole("checkbox")));
    const addProfitButton = screen.getByRole("button", {
      name: /Add profit target/i,
    });
    userEvent.click(addProfitButton);
    userEvent.click(addProfitButton);

    const deleteIcons = screen.queryAllByLabelText("delete_profit");

    await waitFor(() => userEvent.click(deleteIcons[2]));
    await waitFor(() => {});
    expect(container.getElementsByClassName("take-profit__inputs").length).toBe(
      2,
    );
    await waitFor(() => userEvent.click(deleteIcons[1]));
    await waitFor(() => userEvent.click(deleteIcons[0]));
    expect(container.getElementsByClassName("take-profit__inputs").length).toBe(
      0,
    );

    userEvent.click(screen.getByRole("button", { name: "submit" }));
    await waitFor(() =>
      expect(output).toMatchObject({
        profits: [],
        with_profit: false,
      }),
    );
  });
});
