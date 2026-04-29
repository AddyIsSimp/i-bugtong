import PasswordInput from "@/components/PasswordInput";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { router } from "expo-router";
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confPasswordError, setConfPasswordError] = useState('');

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password: string): boolean => {
    // At least 8 characters and contains at least one number
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Validate username
  const validateUsername = (value: string) => {
    setUsername(value);
    if (!value.trim()) {
      setUsernameError('Username is required');
    } else if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
    } else {
      setUsernameError('');
    }
  };

  // Validate email
  const validateEmail = (value: string) => {
    setEmail(value);
    if (!value.trim()) {
      setEmailError('Email is required');
    } else if (!isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Validate password
  const validatePassword = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required');
    } else if (!isValidPassword(value)) {
      setPasswordError('Password must be at least 8 characters and contain at least one number');
    } else {
      setPasswordError('');
    }

    // Also validate confirm password if it has a value
    if (confPassword) {
      if (confPassword !== value) {
        setConfPasswordError('Passwords do not match');
      } else {
        setConfPasswordError('');
      }
    }
  };

  // Validate confirm password
  const validateConfPassword = (value: string) => {
    setConfPassword(value);
    if (!value) {
      setConfPasswordError('Please confirm your password');
    } else if (value !== password) {
      setConfPasswordError('Passwords do not match');
    } else {
      setConfPasswordError('');
    }
  };

  // Handle form submission
  const handleSignup = () => {
    // Validate all fields
    validateUsername(username);
    validateEmail(email);
    validatePassword(password);
    validateConfPassword(confPassword);

    // Check if there are any errors
    if (!username || !email || !password || !confPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (usernameError || emailError || passwordError || confPasswordError) {
      Alert.alert('Error', 'Please fix the errors before continuing');
      return;
    }

    // If validation passes
    Alert.alert(
      'Success',
      'Account created successfully!',
      [{ text: 'OK', onPress: () => router.replace('/sign-in') }]
    );
  };

  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleAcceptPrivacy = () => {
    setPrivacyAccepted(true);
    setPrivacyModalVisible(false);
    // Continue with signup
  };

  return (
    <View className="flex-1 items-center justify-between p-4">
      {/* Spacer */}
      <View className="w-10"></View>

      <View className="flex-col gap-8 w-full">
        <View className="flex-col gap-2 items-center">
          <Text className="text-2xl font-bold">Create Account</Text>
          <Text className="text-center leading-6">{'Create account with your username, \n email and password'}</Text>
        </View>

        <View className="flex-col gap-4">
          {/* Username Field */}
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Username</Text>
            <TextInput
              className={`p-3 border-2 w-full rounded-full ${usernameError ? 'border-red-500' : 'border-gray-500'}`}
              placeholder="Enter username"
              value={username}
              onChangeText={validateUsername}
              autoCapitalize="none"
            />
            {usernameError ? <Text className="text-red-500 text-sm px-3">{usernameError}</Text> : null}
          </View>

          {/* Email Field */}
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Email</Text>
            <TextInput
              className={`p-3 border-2 w-full rounded-full ${emailError ? 'border-red-500' : 'border-gray-500'}`}
              placeholder="Enter email"
              value={email}
              onChangeText={validateEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? <Text className="text-red-500 text-sm px-3">{emailError}</Text> : null}
          </View>

          {/* Password Field */}
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Password</Text>
            <PasswordInput
              containerClassName={`${passwordError ? 'border-red-500' : 'border-gray-500'}`}
              inputClassName=""
              iconClassName=""
              placeholder="Your password"
              value={password}
              onChangeText={validatePassword}
            />
            {passwordError ? <Text className="text-red-500 text-sm px-3">{passwordError}</Text> : null}
          </View>

          {/* Confirm Password Field */}
          <View className="w-full flex-col gap-1">
            <Text className="px-2 text-md font-medium">Confirm Password</Text>
            <PasswordInput
              containerClassName={`${confPasswordError ? 'border-red-500' : 'border-gray-500'}`}
              inputClassName=""
              iconClassName=""
              placeholder="Confirm password"
              value={confPassword}
              onChangeText={validateConfPassword}
            />
            {confPasswordError ? <Text className="text-red-500 text-sm px-3">{confPasswordError}</Text> : null}
          </View>
        </View>

        <View className="flex-col items-center gap-4">
          <View className="flex items-center justify-center w-full">
            <TouchableOpacity
              className="bg-accent w-4/5 px-4 py-3 rounded-full"
              onPress={handleSignup}
            >
              <Text className="text-white text-center">Create</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-1">
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text className="text-blue-500 underline text-md">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mt-4">
        <Text>Read the</Text>
        <TouchableOpacity>
          <Text className="text-blue-500 underline">Privacy Policy</Text>
        </TouchableOpacity>
        <Text>and</Text>
        <TouchableOpacity>
          <Text className="text-blue-500 underline">Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        onAccept={handleAcceptPrivacy}
        showAccept={true}
      />
    </View>
  );
}