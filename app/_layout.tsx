import AppStartupGate from '@/components/AppStartupGate';
import TopNotification from '@/components/TopNotification';
import { AppAudioProvider } from '@/contexts/AppAudioContext';
import { AudioSettingsProvider } from '@/contexts/AudioSettingsContext';
import { GameProvider } from '@/contexts/GameContext';
import { UserProvider } from '@/contexts/UserContext';
import '@/global.css';
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <GameProvider>
        <AudioSettingsProvider>
          <AppAudioProvider>
            <AppStartupGate>
              <Stack screenOptions={{ headerShown: false }} />
              <TopNotification />
            </AppStartupGate>
          </AppAudioProvider>
        </AudioSettingsProvider>
      </GameProvider>
    </UserProvider>);
}


