import { ReactNode } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const clearAndTypeTextBox = async (
  name: string,
  newValue: string,
): Promise<{ element: ReactNode }> => {
  const element = screen.getByRole("textbox", { name });

  userEvent.clear(element);
  userEvent.type(element, newValue);

  return new Promise((resolve) => resolve({ element }));
};
