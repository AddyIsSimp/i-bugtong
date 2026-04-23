// components/ProfileModal.tsx
import Avatar from "@/components/Avatar";
import { useUser } from "@/contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
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

    const handleSave = () => {
        updateUserInfo({
            name: name,
            profile: profileImage,
        });
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditable(false);
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

        // If not in edit mode, update immediately
        if (!isEditable) {
            updateUserInfo({ profile: newProfileImage });
            // Also update original values to match
            setOriginalProfileImage(newProfileImage);
        }
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
                                    >
                                        <Text className="text-white">{isEditable ? "Save" : "Edit"}</Text>
                                    </TouchableOpacity>
                                    {isEditable && (
                                        <TouchableOpacity
                                            className="h-10 flex-row gap-1 items-center justify-center p-2 bg-gray-600 rounded-full"
                                            onPress={handleCancel}
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