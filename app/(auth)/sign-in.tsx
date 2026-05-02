import PasswordInput from "@/components/PasswordInput";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsModal from "@/components/TermsModal";
import { useGame } from "@/contexts/GameContext";
import { useUser } from "@/contexts/UserContext";
import { login } from "@/services/api";
import { router } from "expo-router";
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signin() {
  const { signIn } = useUser();
  const { syncGameAssetsFromLogin } = useGame();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Missing username", "Please enter your username or email.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Missing password", "Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await login(username.trim(), password);

      if (result.status !== 200 || !result.data) {
        Alert.alert("Login failed", result.error || "Invalid credentials.");
        return;
      }

      signIn({ name: result.data.username, points: result.data.points });
      syncGameAssetsFromLogin({
        diamond: result.data.diamond,
        life: result.data.life,
        hint: result.data.hint,
      });
      router.replace("/(tabs)/play");
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Something went wrong during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-between p-4">
      {/* Signin Content */}
      <View className="w-10"></View>

      <View className="flex-col gap-8 w-full">
        <View className="flex-col gap-2 items-center">
          <Text className="text-2xl font-bold">Login</Text>
          <Text className="text-center leading-6">{'Sign in with your username or email \n and password to continue'}</Text>
        </View>

        <View className="flex-col gap-4">
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Username or Email</Text>
            <TextInput
              className="p-3 border-2 w-full rounded-full border-gray-500"
              placeholder="Enter your username or email"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Password</Text>
            <PasswordInput
              containerClassName=""
              inputClassName=""
              iconClassName=""
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
            />
            <View className="w-full px-3">
              <TouchableOpacity onPress={() => router.replace('/forgot')} className="self-end">
                <Text className="text-blue-500 text-md text-right w-fit">Forgot Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-col items-center gap-4">
          <View className="flex items-center justify-center w-full">
            <TouchableOpacity
              className={`bg-accent w-4/5 px-4 py-3 rounded-full ${isSubmitting ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center">{isSubmitting ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-1">
            <Text>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("/sign-up")}>
              <Text className="text-blue-500 underline text-md">Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mt-4">
        <Text>Read the</Text>
        <TouchableOpacity onPress={() => setPrivacyModalVisible(true)}>
          <Text className="text-blue-500 underline">Privacy Policy</Text>
        </TouchableOpacity>
        <Text>and</Text>
        <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
          <Text className="text-blue-500 underline">Terms and Conditions</Text>
        </TouchableOpacity>
      </View>

      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />

      <TermsModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
    </View>
  );
}
