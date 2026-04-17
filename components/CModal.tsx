import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';

export interface CModalRef {
    open: () => void;
    close: () => void;
    toggle: () => void;
}

interface CModalProps {
    children?: ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
    closeOnBackdropPress?: boolean;
    closeOnBackButton?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    containerClassName?: string;
    contentClassName?: string;
    initialVisible?: boolean;
}

const CModal = forwardRef<CModalRef, CModalProps>(({
    children,
    onOpen,
    onClose,
    closeOnBackdropPress = true,
    closeOnBackButton = true,
    animationType = 'fade',
    transparent = true,
    containerClassName = '',
    contentClassName = '',
    initialVisible = false
}, ref) => {
    const [modalVisible, setModalVisible] = useState(initialVisible);

    useImperativeHandle(ref, () => ({
        open: () => {
            setModalVisible(true);
            onOpen?.();
        },
        close: () => {
            setModalVisible(false);
            onClose?.();
        },
        toggle: () => {
            setModalVisible(!modalVisible);
            if (!modalVisible) {
                onOpen?.();
            } else {
                onClose?.();
            }
        },
    }));

    const handleBackdropPress = () => {
        if (closeOnBackdropPress) {
            setModalVisible(false);
            onClose?.();
        }
    };

    return (
        <Modal
            animationType={animationType}
            transparent={transparent}
            visible={modalVisible}
            onRequestClose={() => {
                if (closeOnBackButton) {
                    setModalVisible(false);
                    onClose?.();
                }
            }}>

            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View className={`absolute top-0 left-0 w-full h-full items-center justify-center bg-black/50 ${containerClassName}`}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View className={` ${contentClassName}`}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
})

CModal.displayName = 'CModal';

export default CModal;