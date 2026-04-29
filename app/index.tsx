import { useUser } from "@/contexts/UserContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useUser();

  return <Redirect href={isAuthenticated ? "/(tabs)/play" : "/(auth)/sign-in"} />;
}
