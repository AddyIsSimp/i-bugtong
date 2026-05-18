// components/ProfileModal.tsx
import Avatar from "@/components/Avatar";
import { useUser } from "@/contexts/UserContext";
import { toAbsoluteApiUrl, updateProfile } from "@/services/api";
import { showErrorNotification } from "@/utils/errorNotification";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    ImageSourcePropType,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import CaptureModal from "./CaptureModal";

interface ProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
    const { userInfo, updateUserInfo } = useUser();
    const [isEditable, setIsEditable] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [name, setName] = React.useState(userInfo.name);
    const [profileImage, setProfileImage] = React.useState<ImageSourcePropType>(userInfo.profile);
    const [captureModalVisible, setCaptureModalVisible] = React.useState(false);
    
    // Store original values when entering edit mode
    const [originalName, setOriginalName] = React.useState(userInfo.name);
    const [originalProfileImage, setOriginalProfileImage] = React.useState<ImageSourcePropType>(userInfo.profile);

    // Reset form when modal opens
    React.useEffect(() => {
        if (visible) {
            setName(userInfo.name);
            setProfileImage(userInfo.profile);
            // Also reset original values
            setOriginalName(userInfo.name);
            setOriginalProfileImage(userInfo.profile);
        }
    }, [visible, userInfo]);

    const getImageUri = (image: ImageSourcePropType) =>
        typeof image === 'object' && image !== null && 'uri' in image ? image.uri ?? null : null;

    const handleSave = async () => {
        if (userInfo.id == null) {
            showErrorNotification("Please log in again before updating your profile.", "Missing User");
            return;
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
            showErrorNotification("Please enter a name before saving.", "Missing Name");
            return;
        }

        const originalImageUri = getImageUri(originalProfileImage);
        const currentImageUri = getImageUri(profileImage);
        const hasNameChanged = trimmedName !== originalName.trim();
        const hasProfileChanged = currentImageUri !== originalImageUri;

        if (!hasNameChanged && !hasProfileChanged) {
            setIsEditable(false);
            return;
        }

        try {
            setIsSaving(true);

            const response = await updateProfile({
                userId: userInfo.id,
                username: hasNameChanged ? trimmedName : undefined,
                profileUri: hasProfileChanged ? currentImageUri ?? undefined : undefined,
            });

            const remoteProfileUri = toAbsoluteApiUrl(response.profile_path);
            const nextProfile = remoteProfileUri
                ? { uri: remoteProfileUri }
                : profileImage;

            updateUserInfo({
                name: response.username || trimmedName,
                profile: nextProfile,
                profileKey: null,
            });
            setProfileImage(nextProfile);
            setOriginalName(response.username || trimmedName);
            setOriginalProfileImage(nextProfile);
            setIsEditable(false);
        } catch (error) {
            showErrorNotification(
                error instanceof Error ? error.message : "Unable to update your profile right now.",
                "Update Failed"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        if (isEditable) {
            handleSave();
        } else {
            // Store current values as original before entering edit mode
            setOriginalName(name);
            setOriginalProfileImage(profileImage);
            setIsEditable(true);
        }
    };

    const handleCancel = () => {
        // Revert to original values
        setName(originalName);
        setProfileImage(originalProfileImage);
        setIsEditable(false);
    };

    const handleImageCaptured = (imageUri: string) => {
        const newProfileImage = { uri: imageUri };
        setProfileImage(newProfileImage);
        console.log("Image captured:", imageUri);
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="flex-1 items-center justify-center bg-gray-900/70">
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <View className="w-4/5 h-4/6 flex-col justify-between bg-white rounded-2xl p-4 gap-4 shadow-lg -mt-20 pb-20">
                                <View className="flex-row items-center justify-between gap-2">
                                    <TouchableOpacity
                                        className="rounded-full bg-gray-100 p-2"
                                        onPress={onClose}
                                    >
                                        <MaterialIcons name="arrow-back" size={24} color="black" />
                                    </TouchableOpacity>
                                    <View className="flex-row items-center justify-center">
                                        <Text className="text-center font-bold text-xl">Profile</Text>
                                    </View>
                                    <View className="w-10" />
                                </View>

                                <View className="flex-col gap-5">
                                    <View className="flex-col gap-4 items-center justify-center rounded-full">
                                        <View className="relative">
                                            {/* Pass the profileImage state to Avatar */}
                                            <Avatar source={profileImage} />
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                className="absolute bottom-0 right-0 bg-accent p-2 rounded-lg flex-row gap-2"
                                                style={{ display: isEditable ? 'flex' : 'none' }}
                                                onPress={() => setCaptureModalVisible(true)}
                                            >
                                                <MaterialIcons name="edit" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View className="flex-col gap-2">
                                        <View className="flex-col gap-1">
                                            <Text className="text-md pl-1">Name</Text>
                                            <TextInput
                                                className={`border p-3 rounded-xl ${isEditable ? 'bg-white border-primary' : 'bg-gray-200 border-gray-400'}`}
                                                value={name}
                                                onChangeText={setName}
                                                editable={isEditable}
                                                placeholder="Enter your name"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-col gap-2 h-22 justify-start">
                                    <TouchableOpacity
                                        className="h-10 flex-row gap-1 items-center justify-center p-2 bg-accent rounded-full"
                                        onPress={handleEdit}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text className="text-white">{isEditable ? "Save" : "Edit"}</Text>
                                        )}
                                    </TouchableOpacity>
                                    {isEditable && (
                                        <TouchableOpacity
                                            className="h-10 flex-row gap-1 items-center justify-center p-2 bg-gray-600 rounded-full"
                                            onPress={handleCancel}
                                            disabled={isSaving}
                                        >
                                            <Text className="text-white">Cancel</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <CaptureModal
                visible={captureModalVisible}
                onClose={() => setCaptureModalVisible(false)}
                onImageCaptured={handleImageCaptured}
            />
        </>
    );
}
