import { Redirect } from "expo-router";

import { ROUTES } from "@/navigation/routes";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { useAuthStore } from "@/store/authStore";

export default function IndexRoute() {
  const session = useAuthStore((state) => state.session);

  if (session) {
    return <Redirect href={ROUTES.dashboard} />;
  }

  return <LoginScreen />;
}
