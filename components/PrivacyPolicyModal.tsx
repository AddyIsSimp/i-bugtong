import { Modal, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PrivacyPolicyProps {
    visible: boolean;
    onClose: () => void;
    onAccept?: () => void;
    showAccept?: boolean;
}

export default function PrivacyPolicyModal({ 
    visible, 
    onClose, 
    onAccept, 
    showAccept = true 
}: PrivacyPolicyProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* Backdrop View - no Pressable wrapper */}
            <View className="flex-1 items-center justify-center bg-gray-900/70">
                {/* Modal Content - no outer Pressable interfering */}
                <View 
                    className="bg-white rounded-2xl"
                    style={{ height: "85%", width: "85%" }}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold">Privacy Policy</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        className="flex-1 px-4"
                        showsVerticalScrollIndicator={true}
                        decelerationRate="normal"
                        scrollEventThrottle={16}
                        removeClippedSubviews={true}
                        nestedScrollEnabled={true}
                    >
                        <Text className="text-xs text-gray-500 mb-4">
                            Last updated: {new Date().toLocaleDateString()}
                        </Text>
                        
                        <Text className="text-base font-semibold mb-2 mt-2">1. Information We Collect</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We collect the following information when you create an account and use our app:
                            {"\n\n"}• Username (provided during account creation)
                            {"\n"}• Email address (provided during account creation)
                            {"\n"}• Game progress and scores
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">2. How We Use Your Information</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We use your information to:
                            {"\n\n"}• Create and manage your account
                            {"\n"}• Track your game progress and rankings
                            {"\n"}• Communicate important updates about the app
                            {"\n"}• Improve our app features and user experience
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">3. Data Storage and Security</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            Your information is stored securely using industry-standard practices. We take reasonable measures to protect your data from unauthorized access, alteration, or disclosure.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">4. Third-Party Services</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We do not sell, trade, or transfer your personal information to third parties. We may share information only:
                            {"\n\n"}• As required by law
                            {"\n"}• To protect our legal rights
                            {"\n"}• With your explicit consent
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">5. Your Rights</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            You have the right to:
                            {"\n\n"}• Access your personal information
                            {"\n"}• Request correction of inaccurate data
                            {"\n"}• Request deletion of your account and data
                            {"\n"}• Opt out of communications
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">6. Children's Privacy</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            Our app is not directed to children under 13. We do not knowingly collect personal information from children under 13.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">7. Changes to This Policy</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">8. Contact Us</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            If you have questions about this Privacy Policy, contact us at:
                            {"\n\n"}Email: privacy@ibugtong.com
                        </Text>
                    
                        <View className="h-6" />
                    </ScrollView>

                    {/* Accept Button */}
                    {showAccept && onAccept && (
                        <View className="p-4 pt-2">
                            <TouchableOpacity 
                                className="bg-accent py-3 rounded-full"
                                onPress={onAccept}
                                activeOpacity={0.7}
                            >
                                <Text className="text-white text-center font-semibold">
                                    I Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}