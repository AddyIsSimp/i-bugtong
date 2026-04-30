import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PasswordInputProps extends TextInputProps {
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  placeholder?: string;
  editable?: boolean;
}

export default function PasswordInput({ 
  containerClassName = '',
  inputClassName = '',
  iconClassName = '',
  editable = true,
  placeholder = 'Enter password',
  value,
  onChangeText,
  ...restProps
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className={`flex-row items-center border-2 border-gray-500 rounded-full px-4 w-full ${containerClassName}`}>
      <TextInput
        className={`flex-1 py-3 text-base ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        {...restProps}
      />
      
      <TouchableOpacity 
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        className={`ml-2 ${iconClassName}`}
        activeOpacity={0.7}
      >
        {isPasswordVisible ? (
          <MaterialIcons name="visibility" size={20} color="#666" />
        ) : (
          <MaterialIcons name="visibility-off" size={20} color="#666" />
        )}
      </TouchableOpacity>
    </View>
  );
}