import Avatar from "@/components/Avatar";
import { profileCharacterChoices } from "@/constants/data";
import { useUser } from "@/contexts/UserContext";
import { uploadProfileAvatar } from "@/services/api";
import { Asset } from "expo-asset";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AvatarSetup() {
    const { isAuthenticated, hasCompletedProfileSetup, userInfo, completeProfileSetup } = useUser();
    const [selectedCharacterKey, setSelectedCharacterKey] = useState<string | null>(profileCharacterChoices[0]?.key ?? null);
    const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedCharacter = useMemo(
        () => profileCharacterChoices.find((choice) => choice.key === selectedCharacterKey) ?? null,
        [selectedCharacterKey]
    );

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    if (hasCompletedProfileSetup) {
        return <Redirect href="/(tabs)/play" />;
    }

    const previewSource = uploadedImageUri
        ? { uri: uploadedImageUri }
        : selectedCharacter?.source;

    const handleUploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Needed", "Please allow photo library access to upload an avatar.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]?.uri) {
            setUploadedImageUri(result.assets[0].uri);
        }
    };

    const resolveSelectedImageUri = async () => {
        if (uploadedImageUri) {
            return uploadedImageUri;
        }

        if (!selectedCharacter) {
            return null;
        }

        const asset = Asset.fromModule(selectedCharacter.source as number);
        await asset.downloadAsync();
        return asset.localUri ?? asset.uri;
    };

    const handleContinue = async () => {
        if (userInfo.id == null) {
            Alert.alert("Missing User", "Please log in again before continuing.");
            return;
        }

        const imageUri = await resolveSelectedImageUri();
        if (!imageUri) {
            Alert.alert("No Avatar Selected", "Choose a character or upload an image to continue.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await uploadProfileAvatar({
                userId: userInfo.id,
                imageUri,
                characterKey: uploadedImageUri ? undefined : selectedCharacter?.key,
            });

            const remoteProfileUri = response.avatar_url || response.profile_url || response.image_url;
            const usedLocalFallback = !remoteProfileUri && response.message?.includes('endpoint is not available');

            completeProfileSetup({
                profile: remoteProfileUri
                    ? { uri: remoteProfileUri }
                    : uploadedImageUri
                        ? { uri: uploadedImageUri }
                        : (selectedCharacter?.source ?? userInfo.profile),
                profileKey: remoteProfileUri || uploadedImageUri ? null : selectedCharacter?.key ?? null,
            });

            if (usedLocalFallback) {
                Alert.alert(
                    "Avatar Saved Locally",
                    "Your server does not support avatar upload yet, so the selected avatar was saved only on this device."
                );
            }

            router.replace('/(tabs)/play');
        } catch (error) {
            Alert.alert(
                "Avatar Upload Failed",
                error instanceof Error ? error.message : "Unable to save your avatar right now."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 px-5 pb-8">
            <View className="pt-6 items-center">
                <Text className="text-3xl font-bold text-primary">Choose Your Character</Text>
                <Text className="text-center text-gray-700 mt-2">
                    Pick one of the built-in characters or upload your own image for your in-game avatar.
                </Text>
            </View>

            <View className="items-center mt-6">
                <Avatar source={previewSource} size="xl" />
            </View>

            <TouchableOpacity
                className="mt-5 rounded-full bg-primary px-5 py-3"
                onPress={handleUploadImage}
                activeOpacity={0.85}
            >
                <Text className="text-center text-white font-medium">
                    {uploadedImageUri ? 'Change Uploaded Image' : 'Upload From Gallery'}
                </Text>
            </TouchableOpacity>

            <ScrollView className="mt-6" contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="flex-row flex-wrap justify-between">
                    {profileCharacterChoices.map((choice) => {
                        const isSelected = !uploadedImageUri && selectedCharacterKey === choice.key;

                        return (
                            <TouchableOpacity
                                key={choice.key}
                                className={`mb-4 w-[48%] rounded-3xl border p-3 ${isSelected ? 'border-accent bg-accent/10' : 'border-gray-300 bg-white/80'}`}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setUploadedImageUri(null);
                                    setSelectedCharacterKey(choice.key);
                                }}
                            >
                                <Image
                                    source={choice.source}
                                    className="h-36 w-full rounded-2xl"
                                    resizeMode="cover"
                                />
                                <Text className="mt-3 text-center font-semibold text-primary">{choice.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <TouchableOpacity
                className={`rounded-full px-5 py-4 ${isSubmitting ? 'bg-accent/70' : 'bg-accent'}`}
                onPress={handleContinue}
                disabled={isSubmitting}
                activeOpacity={0.85}
            >
                {isSubmitting ? (
                    <View className="flex-row items-center justify-center gap-2">
                        <ActivityIndicator size="small" color="white" />
                        <Text className="text-white font-semibold">Saving Avatar...</Text>
                    </View>
                ) : (
                    <Text className="text-center text-white font-semibold">Continue</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
