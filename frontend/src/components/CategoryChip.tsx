import { StyleSheet, Text, View } from 'react-native';
import { GoalCategory } from '../types';

export default function CategoryChip({ category }: { category: GoalCategory }) {
  return (
    <View style={[styles.container, { backgroundColor: category.colorHex }]}> 
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={styles.label}>{category.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  emoji: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#1c1c1c' }
});
