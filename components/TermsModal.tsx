import { Modal, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TermsModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept?: () => void;
    showAccept?: boolean;
}

export default function TermsModal({ 
    visible, 
    onClose, 
    onAccept, 
    showAccept = true 
}: TermsModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center bg-gray-900/70">
                <View 
                    className="bg-white rounded-2xl"
                    style={{ height: "85%", width: "85%" }}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold">Terms and Conditions</Text>
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

                        <Text className="text-base font-semibold mb-2 mt-2">1. Acceptance of Terms</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            By creating an account and using iBugtong, you agree to be bound by these Terms and Conditions. 
                            If you do not agree to these terms, please do not use our app.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">2. User Accounts</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            You are responsible for maintaining the confidentiality of your account credentials. 
                            You agree to accept responsibility for all activities that occur under your account. 
                            You must be at least 13 years old to create an account.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">3. User Conduct</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            You agree not to:
                            {"\n\n"}• Use the app for any illegal purpose
                            {"\n"}• Attempt to gain unauthorized access to our systems
                            {"\n"}• Interfere with or disrupt the app's functionality
                            {"\n"}• Submit false or misleading information
                            {"\n"}• Harass, abuse, or harm other users
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">4. Intellectual Property</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            All content, features, and functionality of iBugtong, including but not limited to 
                            questions, answers, images, and code, are owned by iBugtong and are protected by 
                            intellectual property laws. You may not copy, modify, or distribute any content 
                            without our prior written consent.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">5. User-Generated Content</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            By submitting answers or images through the app, you grant us a non-exclusive, 
                            royalty-free license to use, store, and process this content to provide and improve 
                            our services. You are solely responsible for the content you submit.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">6. Termination</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We reserve the right to suspend or terminate your account at our sole discretion, 
                            without notice, for conduct that violates these Terms or is harmful to other users, 
                            us, or third parties.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">7. Disclaimer of Warranties</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            The app is provided "as is" and "as available" without any warranties of any kind. 
                            We do not guarantee that the app will be uninterrupted, error-free, or free of viruses 
                            or other harmful components.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">8. Limitation of Liability</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            To the fullest extent permitted by law, iBugtong shall not be liable for any indirect, 
                            incidental, special, consequential, or punitive damages resulting from your use of 
                            or inability to use the app.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">9. Changes to Terms</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            We may modify these Terms at any time. We will notify you of material changes by 
                            posting the new Terms in the app or through other reasonable means. Your continued 
                            use of the app after such changes constitutes your acceptance.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">10. Governing Law</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            These Terms shall be governed by and construed in accordance with the laws of the 
                            Philippines, without regard to its conflict of law provisions.
                        </Text>

                        <Text className="text-base font-semibold mb-2 mt-2">11. Contact Us</Text>
                        <Text className="text-sm text-gray-700 mb-3 leading-5">
                            If you have questions about these Terms, contact us at:
                            {"\n\n"}Email: terms@ibugtong.com
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