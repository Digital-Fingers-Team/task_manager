import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";

import { FormPasswordInput } from "@/components/FormPasswordInput";
import { FormTextInput } from "@/components/FormTextInput";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ROUTES } from "@/navigation/routes";
import { useAuthStore } from "@/store/authStore";
import { spacing } from "@/theme";
import {
  registerSchema,
  type RegisterFormValues
} from "@/utils/validation";

export const RegisterScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password
    });

    if (result.success) {
      router.replace(ROUTES.dashboard);
    }
  });

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Avatar.Icon
            icon="account-plus-outline"
            size={72}
            color={theme.colors.primary}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Create account
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Your tasks stay private on this device.
          </Text>
        </View>

        <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <FormTextInput
              control={control}
              name="name"
              label="Name"
              placeholder="Your name"
              autoCapitalize="words"
              textContentType="name"
            />
            <FormTextInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <FormPasswordInput
              control={control}
              name="password"
              label="Password"
              textContentType="newPassword"
            />
            <FormPasswordInput
              control={control}
              name="confirmPassword"
              label="Confirm password"
              textContentType="newPassword"
            />
            {authError ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                {authError}
              </Text>
            ) : null}
            <Button
              mode="contained"
              icon="account-check-outline"
              loading={isLoading}
              disabled={isLoading}
              onPress={onSubmit}
              contentStyle={styles.submitButton}
              style={styles.submit}
            >
              Register
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Already registered?
          </Text>
          <Link href={ROUTES.login} asChild>
            <Button mode="text">Login</Button>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xl
  },
  header: {
    alignItems: "center",
    gap: spacing.sm
  },
  title: {
    fontWeight: "800",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center"
  },
  card: {
    borderRadius: 18
  },
  submit: {
    marginTop: spacing.md
  },
  submitButton: {
    minHeight: 52
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  }
});
