import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
};

export default function PrimaryButton({
                                          label,
                                          onPress,
                                          disabled,
                                          loading,
                                      }: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
        >
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.text}>{label}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#34d399',
        borderRadius: 999,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#d4d4d4',
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});