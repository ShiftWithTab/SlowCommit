import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PixelCard({ message }: { message: string }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.avatar}>🧑‍💼</Text>
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
  }
});
