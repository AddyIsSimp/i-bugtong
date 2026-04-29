import PasswordInput from "@/components/PasswordInput";
import { router } from "expo-router";
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 items-center justify-between p-4">
      {/* Signin Content */}
      <View className="w-10"></View>

      <View className="flex-col gap-8 w-full">
        <View className="flex-col gap-2 items-center">
          <Text className="text-2xl font-bold">Forgot Password</Text>
          <Text className="text-center leading-6">{'Sign in with your username or email \n and password to continue'}</Text>
        </View>

        <View className="flex-col gap-4">
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Email</Text>
            <TextInput
              className="p-3 border-2 w-full rounded-full border-gray-500"
              placeholder="Enter your email"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

        <View className="flex-col items-center gap-4">
          <View className="flex items-center justify-center w-full">
            <TouchableOpacity className="bg-accent w-4/5 px-4 py-3 rounded-full">
              <Text className="text-white text-center">Send OTP</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text className="text-blue-500 underline text-md">Go back to login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mt-4">
        <Text>Read the</Text>
        <TouchableOpacity onPress={() => router.push("/sign-up")}>
          <Text className="text-blue-500 underline">Privacy Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}