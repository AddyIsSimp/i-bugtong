import { useUser } from "@/contexts/UserContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isHydrated, hasCompletedProfileSetup } = useUser();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href={hasCompletedProfileSetup ? "/(tabs)/play" : "/(auth)/avatar-setup"} />;
}
