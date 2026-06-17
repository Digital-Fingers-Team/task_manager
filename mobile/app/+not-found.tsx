import { useRouter } from "expo-router";

import { EmptyState } from "@/components/EmptyState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ROUTES } from "@/navigation/routes";

export default function NotFoundRoute() {
  const router = useRouter();

  return (
    <ScreenContainer contentStyle={{ justifyContent: "center" }}>
      <EmptyState
        icon="map-marker-question-outline"
        title="Page not found"
        message="The screen you opened does not exist."
        actionLabel="Go home"
        onAction={() => {
          router.replace(ROUTES.dashboard);
        }}
      />
    </ScreenContainer>
  );
}
