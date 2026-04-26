import { StyleSheet, Text, View } from 'react-native';
import { GoalCategory } from '../types';
import { TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
export default function CategoryChip({
                                       category,
                                       isSelected,
                                       onPress
                                     }: {
  category: GoalCategory;
  isSelected: boolean;
  onPress: () => void;
}) {
    const theme = useTheme();
    const isActive = category.active;
    const isExpired = !isActive;
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
                      backgroundColor: isSelected ? isExpired ?  theme.border: theme.primary : theme.card,
                      opacity: isExpired && !isSelected ? 0.4 : 1,

                      borderWidth: 2,
                      borderColor: isSelected ? theme.primary : 'transparent',

                      transform: [{ scale: isSelected ? 1.02 : 1 }],

                      shadowColor: category.colorHex,
                      // shadowOpacity: isSelected ? 0.2 : 0,
                      shadowOpacity: isSelected ? 0.2 : isActive ? 0.05 : 0,
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
                      {
                          color: isSelected
                              ? isExpired
                                  ? theme.text        // 회색 위니까 기본 텍스트
                                  : '#1D3A29'         // 초록 위 텍스트
                              : isExpired
                                  ? '#8E8E93'
                                  : theme.text,
                      },
                  ]}
                  numberOfLines={1}
              >
                  {category.name}{isExpired ? ' · 종료' : ''}
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
  label: { fontSize: 13, fontWeight: '700', }
});
