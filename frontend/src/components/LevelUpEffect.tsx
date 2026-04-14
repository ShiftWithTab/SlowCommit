// components/LevelUpEffect.tsx
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';

export default function LevelUpEffect({ trigger }: { trigger: boolean }) {
    const [show, setShow] = useState(false);
    const scale = new Animated.Value(1);

    useEffect(() => {
        if (trigger) {
            setShow(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.05,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();

            setTimeout(() => setShow(false), 2000);
        }
    }, [trigger]);

    if (!show) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: [{ scale }],
                zIndex: 999,
            }}
        >
            <ConfettiCannon
                count={120}
                origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
                fadeOut
            />
        </Animated.View>
    );
}