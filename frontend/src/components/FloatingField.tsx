import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type FloatingFieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
};

export default function FloatingField({
                                          label,
                                          value,
                                          onChangeText,
                                          placeholder,
                                      }: FloatingFieldProps) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#c7c7c7"
                style={styles.fieldInput}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldWrap: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
    },
    fieldLabel: {
        fontSize: 12,
        color: '#a3a3a3',
    },
    fieldInput: {
        marginTop: 8,
        fontSize: 16,
        color: '#171717',
        paddingVertical: 4,
    },
});