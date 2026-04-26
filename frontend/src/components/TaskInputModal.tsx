import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from "../theme/ThemeContext";

export default function TaskInputModal({
                                           visible,
                                           onClose,
                                           onSubmit,
                                           onDelete,
                                           initialValue,
                                           title = '새로운 목표',
                                       }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (text: string) => void;
    onDelete?: () => void;
    initialValue?: string;
    title?: string;
}) {
    const theme = useTheme();
    const [text, setText] = useState('');

    useEffect(() => {
        if (visible) {
            setText(initialValue ?? '');
        }
    }, [visible, initialValue]);

    const handleSubmit = () => {
        if (!text.trim()) return;

        onSubmit(text.trim());
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

                        {onDelete && (
                            <Pressable
                                onPress={() => {
                                    Alert.alert(
                                        '삭제',
                                        '정말 삭제하시겠습니까?',
                                        [
                                            {
                                                text: '취소',
                                                style: 'cancel',
                                            },
                                            {
                                                text: '삭제',
                                                style: 'destructive',
                                                onPress: () => {
                                                    onDelete?.();
                                                    onClose();
                                                },
                                            },
                                        ],
                                        { cancelable: true }
                                    );
                                }}
                            >
                                <Text style={[styles.deleteText, { color: '#FF6B6B' }]}>삭제</Text>
                            </Pressable>
                        )}
                    </View>

                    <TextInput
                        style={[styles.input,
                            {
                                backgroundColor: theme.background,
                                color: theme.text,
                                borderColor: theme.border,
                            },]}
                        value={text}
                        onChangeText={setText}
                        autoFocus
                        placeholder="내용을 입력하세요"
                        placeholderTextColor={theme.text + '80'}
                        onSubmitEditing={handleSubmit}
                    />

                    <View style={styles.buttonRow}>
                        <Pressable onPress={onClose}>
                            <Text style={[styles.cancel, { color: theme.text, opacity: 0.6 }]}>취소</Text>
                        </Pressable>

                        <Pressable onPress={handleSubmit}>
                            <Text style={[styles.submit, { color: theme.primary }]}>저장</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,

        borderWidth: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancel: {
        marginRight: 20,
    },
    submit: {
        fontWeight: '600',
    },
    deleteText: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.7,
    },
});