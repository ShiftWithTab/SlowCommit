import { StyleSheet, Text, View, Image } from 'react-native';
import { CONFIG } from '../constants/config';
import { useTheme } from '../theme/ThemeContext';
export default function PixelCard({
                                    message,
                                    avatarUrl,
                                  }: {
  message: string;
  avatarUrl?: string;
}) {
  const theme = useTheme();

  return (
      <View style={[styles.wrapper,{ backgroundColor: theme.background, borderColor : theme.border }]}>
        {avatarUrl ? (
            <Image
                source={{
                  uri: avatarUrl.startsWith('http')
                      ? avatarUrl
                      : `${CONFIG.IMAGE_BASE_URL}${avatarUrl}`,
                }}
                style={styles.avatarImage}
            />
        ) : (
            // <Text style={[styles.fallback,{color : theme.text, opacity: theme.isDark ? 0.9 : 0.85}]}>🧑‍💼</Text>
              <Text style={[styles.message, { color: theme.text }]}>
                🧑
              </Text>
        )}


        <View style={[styles.bubble, { backgroundColor: theme.card }]}>
          <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
    // backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    // borderColor: colors.border
  },
  avatar: {
    fontSize: 64,
    marginRight: 14
  },
  bubble: {
    flex: 1,
    // backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  message: {
    fontSize: 15,
    fontWeight: '700',
    // color: '#222'
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  fallback: {
    fontSize: 48,
    marginRight: 14,
  },
});
