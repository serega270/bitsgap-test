import React from "react";

import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";
import { Switch, SwitchProps } from "../Switch/Switch";

type Props = SwitchProps & {
  name: string;
  defaultChecked?: boolean;
  rules?: RegisterOptions;
};

const FormSwitch = ({
  name,
  rules,
  defaultChecked = false,
  onChange,
  ...props
}: Props) => {
  const { control } = useFormContext() || {};

  const handleChange = (val: boolean, field: ControllerRenderProps) => {
    field.onChange(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <Controller
      render={({ field }) => (
        <Switch
          {...props}
          {...field}
          onChange={(value) => handleChange(value, field)}
        />
      )}
      rules={rules}
      name={name}
      control={control}
      defaultValue={defaultChecked}
    />
  );
};

export { FormSwitch };
