import { useUser } from "@/contexts/UserContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isHydrated } = useUser();

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/(tabs)/play" : "/(auth)/sign-in"} />;
}
