import { useState } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { StyleSheet } from "react-native";
import { HelperText, TextInput, type TextInputProps } from "react-native-paper";

interface FormPasswordInputProps<TFormValues extends FieldValues>
  extends Omit<TextInputProps, "error" | "onChangeText" | "right" | "secureTextEntry" | "value"> {
  control: Control<TFormValues>;
  name: FieldPath<TFormValues>;
}

export const FormPasswordInput = <TFormValues extends FieldValues>({
  control,
  name,
  style,
  ...textInputProps
}: FormPasswordInputProps<TFormValues>) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={isSecure}
            {...textInputProps}
            value={typeof value === "string" ? value : ""}
            onBlur={onBlur}
            onChangeText={onChange}
            error={Boolean(error)}
            style={[styles.input, style]}
            right={
              <TextInput.Icon
                icon={isSecure ? "eye-off-outline" : "eye-outline"}
                onPress={() => {
                  setIsSecure((current) => !current);
                }}
              />
            }
          />
          <HelperText type="error" visible={Boolean(error)}>
            {error?.message}
          </HelperText>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 0
  }
});
