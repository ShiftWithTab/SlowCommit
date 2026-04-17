import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

type Props = {
    visible: boolean;
    title: string;
    value: string;
    placeholder?: string;
    onCancel: () => void;
    onSubmit: (value: string) => void;
};

export default function InputModal({
                                       visible,
                                       title,
                                       value,
                                       placeholder,
                                       onCancel,
                                       onSubmit,
                                   }: Props) {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value, visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>{title}</Text>

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder={placeholder}
                        placeholderTextColor="#999"
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                            <Text style={styles.cancelText}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirm}
                            onPress={() => onSubmit(text)}
                        >
                            <Text style={styles.confirmText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    box: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        color: colors.text,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    cancel: {
        padding: 10,
    },
    cancelText: {
        color: '#999',
        fontWeight: '600',
    },
    confirm: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    confirmText: {
        color: '#fff',
        fontWeight: '700',
    },
});