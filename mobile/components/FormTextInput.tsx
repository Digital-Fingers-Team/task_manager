import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { StyleSheet } from "react-native";
import { HelperText, TextInput, type TextInputProps } from "react-native-paper";

interface FormTextInputProps<TFormValues extends FieldValues>
  extends Omit<TextInputProps, "error" | "onChangeText" | "value"> {
  control: Control<TFormValues>;
  name: FieldPath<TFormValues>;
}

export const FormTextInput = <TFormValues extends FieldValues>({
  control,
  name,
  style,
  ...textInputProps
}: FormTextInputProps<TFormValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
      <>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          {...textInputProps}
          value={typeof value === "string" ? value : ""}
          onBlur={onBlur}
          onChangeText={onChange}
          error={Boolean(error)}
          style={[styles.input, style]}
        />
        <HelperText type="error" visible={Boolean(error)}>
          {error?.message}
        </HelperText>
      </>
    )}
  />
);

const styles = StyleSheet.create({
  input: {
    marginBottom: 0
  }
});
