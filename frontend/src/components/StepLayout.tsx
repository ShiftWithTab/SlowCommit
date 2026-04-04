import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';

type StepLayoutProps = {
    stepText: string;
    progressWidth: DimensionValue;
    onBack: () => void;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footer: React.ReactNode;
};

export default function StepLayout({
                                       stepText,
                                       progressWidth,
                                       onBack,
                                       title,
                                       subtitle,
                                       children,
                                       footer,
                                   }: StepLayoutProps) {
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.topRow}>
                    <Pressable onPress={onBack} hitSlop={12}>
                        <Text style={styles.backText}>← 뒤로</Text>
                    </Pressable>
                    <Text style={styles.stepText}>{stepText}</Text>
                </View>

                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <View style={styles.section}>{children}</View>
            </ScrollView>

            <View style={styles.footer}>{footer}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 12,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backText: {
        fontSize: 14,
        color: '#525252',
    },
    stepText: {
        fontSize: 14,
        color: '#a3a3a3',
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#34d399',
        borderRadius: 999,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 20,
        paddingBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#171717',
        lineHeight: 38,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 15,
        color: '#737373',
        lineHeight: 24,
    },
    section: {
        marginTop: 28,
        gap: 16,
    },
    footer: {
        gap: 12,
        paddingTop: 12,
    },
});