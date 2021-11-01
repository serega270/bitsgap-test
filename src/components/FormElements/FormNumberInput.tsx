import React from "react";

import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { NumberInput, NumberInputProps } from "../NumberInput/NumberInput";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";

type Props = NumberInputProps & {
  name: string;
  rules?: RegisterOptions;
};

const FormNumberInput = ({
  name,
  rules,
  defaultValue = "",
  onChange,
  onBlur,
  ...props
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext() || {};
  const errorMessage = errors[name]?.message;

  const handleChange = (val: number, field: ControllerRenderProps) => {
    field.onChange(val);
    if (onChange) {
      onChange(val);
    }
  };

  const handleBlur = (val: number, field: ControllerRenderProps) => {
    field.onBlur();
    if (onBlur) {
      onBlur(val);
    }
  };

  return (
    <Controller
      render={({ field }) => (
        <NumberInput
          inputProps={{ "aria-label": name }}
          {...props}
          {...field}
          onChange={(value) => handleChange(Number(value), field)}
          onBlur={(value) => handleBlur(Number(value), field)}
          error={errorMessage}
        />
      )}
      rules={rules}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export { FormNumberInput };
