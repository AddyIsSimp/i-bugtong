import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { Image, ImageBackground, StatusBar, Text, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

function LayoutContent() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" translucent backgroundColor={colors.primary} />
      <ImageBackground
        source={images.blob_scene_haikei}
        className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
      />
      <View className="flex-1">
        <View
          className="flex-row items-center px-2"
          style={{ paddingTop: insets.top + 8 }}
        >
          <Image source={images.app_icon} className="w-13 h-13" />
          <Text className="font-medium ml-2 text-black text-lg">iBugtong</Text>
        </View>

        <View
          className="flex-1"
          style={{
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animationDuration: 100,
              contentStyle: {
                backgroundColor: 'transparent'
              }
            }}>
            <Stack.Screen
              name="sign-in"
              options={{ title: "Signin", headerShown: false }}
            />
            <Stack.Screen
              name="sign-up"
              options={{ title: "Signup", headerShown: false }}
            />
            <Stack.Screen
              name="forgot"
              options={{ title: "Forgot", headerShown: false }}
            />
            <Stack.Screen
              name="avatar-setup"
              options={{ title: "Avatar Setup", headerShown: false }}
            />
          </Stack>
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LayoutContent />
    </SafeAreaProvider>
  );
}
