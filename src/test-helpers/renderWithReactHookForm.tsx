import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render as rtlRender } from "@testing-library/react";

import useYup from "../components/hooks/yupValidationResolver";
import { BaseSchema } from "yup";

interface ReactHookFormOptions {
  defaultValues?: { [key: string]: any };
  onSubmit?: (e: { [key: string]: any }) => void;
  resolveSchema?: BaseSchema;
}

export const FormWrapper: React.FC<ReactHookFormOptions> = ({
  children,
  defaultValues = {},
  onSubmit,
  resolveSchema,
}) => {
  const onSubmitHandle = (e: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const methods = useForm({
    defaultValues,
    resolver: resolveSchema ? useYup(resolveSchema) : undefined,
  });
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmitHandle(data))}>
        {children}
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

export function renderWithReactHookForm(
  ui: React.ReactElement,
  { defaultValues = {}, onSubmit, resolveSchema }: ReactHookFormOptions,
) {
  return rtlRender(ui, {
    wrapper: () => (
      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        resolveSchema={resolveSchema}
      >
        {ui}
      </FormWrapper>
    ),
  });
}
