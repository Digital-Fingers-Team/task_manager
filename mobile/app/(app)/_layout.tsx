import { Redirect, Stack } from "expo-router";

import { ROUTES } from "@/navigation/routes";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Redirect href={ROUTES.login} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
