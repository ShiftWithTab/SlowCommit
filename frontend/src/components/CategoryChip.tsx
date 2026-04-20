import { StyleSheet, Text, View } from 'react-native';
import { GoalCategory } from '../types';
import { TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function CategoryChip({
                                       category,
                                       isSelected,
                                       onPress
                                     }: {
  category: GoalCategory;
  isSelected: boolean;
  onPress: () => void;
}) {
  const isActive = category.active;
    const getOpacity = () => {
        if (isSelected) return 1;
        if (!category.active) return 0.5;
        return 0.8;
    };
  return (
      <TouchableOpacity onPress={onPress}>
          <View
              style={[
                  styles.container,
                  {
                      backgroundColor: isActive ? '#ffffff' : '#2A2A2A',
                      opacity: getOpacity(),

                      borderWidth: 2,
                      borderColor: isSelected ? category.colorHex : 'transparent',

                      transform: [{ scale: isSelected ? 1.02 : 1 }],

                      shadowColor: category.colorHex,
                      shadowOpacity: isSelected ? 0.2 : 0,
                      shadowRadius: isSelected ? 6 : 0,
                      shadowOffset: { width: 0, height: 2 },

                      elevation: isSelected ? 3 : 0,
                  }
              ]}
          >
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text
              style={[
                styles.label,
                { color: isActive ? '#1c1c1c' : '#AAAAAA' }
              ]}
          >
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
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
