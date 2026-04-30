// theme/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const lightTheme = {
    background: '#FFFFFF',
    text: '#171717',
    card: '#F8F8F8',
    border: '#E5E5E5',     // ✅ 추가
    primary: '#22C55E',    // ✅ 추천 (버튼/포인트)
    isDark: false,         // ✅ 필수
};

const darkTheme = {
    background: '#050506',
    text: '#FFFFFF',
    card: '#17171B',
    border: '#1f1f1f',     // ✅ 추가
    primary: '#c8f7a6',
    isDark: true,
};

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }: any) => {
    const scheme = useColorScheme();
    console.log('sheme:',scheme);
    const theme = scheme === 'dark' ? darkTheme : lightTheme;

    // const theme = lightTheme;
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);