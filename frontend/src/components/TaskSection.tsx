import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Task } from '../types';
// import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
type Props = {
  title: string;
  color: string;
  tasks: Task[];
  onToggle?: (id: number) => void;
  onAdd?: () => void;
  onLongPress?: (task: Task) => void;
};

export default function TaskSection({
                                      title,
                                      color,
                                      tasks,
                                      onToggle,
                                      onAdd,
                                      onLongPress,
                                    }: Props) {
  const theme = useTheme();
  return (
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View style={[styles.headerPill, { backgroundColor: color }]}>
            <Text style={[styles.headerText, { color: theme.isDark ? '#1c1c1c' : '#1c1c1c' }]}>
              {title}
            </Text>
          </View>

          <Pressable
              onPress={onAdd}
              style={[styles.addButton, { borderColor: theme.text }]}
              hitSlop={10}
          >
            <Ionicons name="add" size={20} color={theme.text} />
          </Pressable>
        </View>

        {tasks.length === 0 ? (

            <Text style={[styles.emptyText, { color: theme.text, opacity: 0.55 }]}>
              오늘 할 일이 없습니다
            </Text>
        ) : (
            tasks.map((task) => (
                <Pressable
                    key={task.id}
                    style={styles.taskRow}
                    onPress={() => onToggle?.(task.id)}
                    onLongPress={() => onLongPress?.(task)}
                    delayLongPress={200}
                >
                  <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                        task.completed && {
                          backgroundColor: theme.text,
                          borderColor: theme.text,
                        },
                      ]}
                  >
                    {task.completed && (
                        <Text style={[styles.check, { color: theme.background }]}>✓</Text>
                    )}
                  </View>

                  <Text
                      style={[
                        styles.taskText,
                        { color: theme.text },
                        task.completed && {
                          opacity: 0.45,
                          textDecorationLine: 'line-through',
                        },
                      ]}
                  >
                    {task.title}
                  </Text>
                </Pressable>
            ))
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontWeight: '700',
    fontSize: 12,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 8,
  },
  addButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 1.8,
    // backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});