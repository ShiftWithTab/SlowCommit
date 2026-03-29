import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>SJ</Text>
      </View>
      <Text style={styles.name}>Shin June</Text>
      <Text style={styles.bio}>꾸준함으로 이직 준비 중인 개발자</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>진행 중 목표</Text>
        <Text style={styles.item}>• 코딩테스트 루틴 유지</Text>
        <Text style={styles.item}>• 자소서 완성</Text>
        <Text style={styles.item}>• 수분 섭취 습관 만들기</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111'
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 18
  },
  bio: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 15
  },
  card: {
    width: '100%',
    marginTop: 26,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 14
  },
  item: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 10
  }
});
