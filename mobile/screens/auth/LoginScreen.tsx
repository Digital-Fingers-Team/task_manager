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
  loginSchema,
  type LoginFormValues
} from "@/utils/validation";

export const LoginScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await login(values);

    if (result.success) {
      router.replace(ROUTES.dashboard);
    }
  });

  return (
    <ScreenContainer contentStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Avatar.Icon
            icon="checkbox-marked-circle-outline"
            size={72}
            color={theme.colors.primary}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Welcome back
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Sign in to manage today with focus.
          </Text>
        </View>

        <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
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
              textContentType="password"
            />
            {authError ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                {authError}
              </Text>
            ) : null}
            <Button
              mode="contained"
              icon="login"
              loading={isLoading}
              disabled={isLoading}
              onPress={onSubmit}
              contentStyle={styles.submitButton}
              style={styles.submit}
            >
              Login
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            New here?
          </Text>
          <Link href={ROUTES.register} asChild>
            <Button mode="text">Create account</Button>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  keyboard: {
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
