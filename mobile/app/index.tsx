import { Redirect } from "expo-router";

import { ROUTES } from "@/navigation/routes";
import { useAuthStore } from "@/store/authStore";

export default function IndexRoute() {
  const session = useAuthStore((state) => state.session);

  return <Redirect href={session ? ROUTES.dashboard : ROUTES.login} />;
}
