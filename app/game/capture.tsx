import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function Capture() {
    const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('camera');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Use the camera permissions hook
    const [permission, requestPermission] = useCameraPermissions();

    const handleCancel = () => {
        router.back();
    };

    const handleCapture = async () => {
        if (activeTab === 'camera') {
            // Check if permission is already granted
            if (!permission?.granted) {
                const permissionResponse = await requestPermission();
                if (!permissionResponse.granted) {
                    console.log("Camera permission denied");
                    return;
                }
            }

            // Take photo using CameraView instead of ImagePicker
            if (cameraRef.current && cameraReady) {
                try {
                    const photo = await cameraRef.current.takePictureAsync({
                        quality: 1,
                        base64: false,
                    });
                    if (photo) {
                        setSelectedImage(photo.uri);
                        console.log("Photo taken: ", photo.uri);
                    }
                } catch (error) {
                    console.log("Error taking photo: ", error);
                }
            }
        } else {
            // Gallery selection
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                console.log("Image selected: ", result.assets[0].uri);
            }
        }
    };

    const removeImage = () => {
        if (selectedImage) {
            console.log("Submitting image: ", selectedImage);
            router.back();
        }
    };

    // Request permissions on mount for camera tab
    if (activeTab === 'camera' && !permission?.granted && permission?.canAskAgain !== false) {
        requestPermission();
    }

    return (
        <View className="flex-1 w-full items-center justify-start">
            {/* Tab bar */}
            <View className="w-5/6 flex-row bg-gray-900/90 rounded-full mx-4 mt-4 p-1">
                <TouchableOpacity
                    className={`flex-1 py-3 rounded-full ${activeTab === 'camera' ? 'bg-blue-500' : 'bg-transparent'}`}
                    onPress={() => setActiveTab('camera')}
                >
                    <Text className="text-center text-white">Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-3 rounded-full ${activeTab === 'gallery' ? 'bg-blue-500' : 'bg-transparent'}`}
                    onPress={() => setActiveTab('gallery')}
                >
                    <Text className="text-center text-white">Gallery</Text>
                </TouchableOpacity>
            </View>

            {/* Camera/Gallery Section */}
            <View className="w-4/5 h-2/5 my-10 rounded-xl overflow-hidden border-2 border-white">
                {activeTab === 'camera' ? (
                    !permission?.granted ? (
                        <View className="flex-1 items-center justify-center bg-black">
                            <Text className="text-white text-center">
                                Camera permission not granted
                            </Text>
                            <TouchableOpacity
                                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                                onPress={requestPermission}
                            >
                                <Text className="text-white">Grant Permission</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="back"
                            onCameraReady={() => setCameraReady(true)}
                        />
                    )
                ) : (
                    <View className="flex-1 items-center justify-center bg-gray-800">
                        <Text className="text-white text-center">
                            Select an image from gallery
                        </Text>
                    </View>
                )}
            </View>

            {/* Display selected image */}
            {selectedImage && (
                <View className="w-4/5 flex-row justify-end">
                    <View className="relative mt-4 w-32 h-32">
                        <Image source={{ uri: selectedImage }} className="w-full h-32 w-32 rounded-lg" />
                        <TouchableOpacity
                            className="absolute top-2 right-2 bg-gray-900/50 p-1 rounded-lg"
                            onPress={removeImage}
                        >
                            <MaterialIcons name="clear" size={24} color='white'/>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Action buttons */}
            <View className="absolute bottom-10 left-0 flex-row justify-between w-full gap-4 px-5">
                <TouchableOpacity
                    className="flex-1 bg-red-500 py-3 rounded-full"
                    onPress={handleCancel}
                >
                    <Text className="text-white text-center font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-green-500 py-3 rounded-full"
                    onPress={handleCapture}
                >
                    <Text className="text-white text-center font-semibold">
                        {activeTab === 'camera' ? 'Take Photo' : 'Select from Gallery'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});