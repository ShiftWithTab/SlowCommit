import { StyleSheet, Text, View, Image } from 'react-native';
import { colors } from '../theme/colors';
import { CONFIG } from '../constants/config';

export default function PixelCard({
                                    message,
                                    avatarUrl,
                                  }: {
  message: string;
  avatarUrl?: string;
}) {
  return (
      <View style={styles.wrapper}>
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
            <Text style={styles.fallback}>🧑‍💼</Text>
        )}


        <View style={styles.bubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border
  },
  avatar: {
    fontSize: 64,
    marginRight: 14
  },
  bubble: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  message: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222'
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
