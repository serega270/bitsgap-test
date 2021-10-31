import { FormProvider, useForm } from "react-hook-form";
import { render as rtlRender } from "@testing-library/react";
import React from "react";
import useYup from "../components/hooks/yupValidationResolver";

interface ReactHookFormOptions {
  defaultValues?: any;
  onSubmit?: (e: any) => void;
  resolveSchema?: any;
}

export const FormWrapper: React.FC<any> = ({
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
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
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
