import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Task } from '../types';
import { colors } from '../theme/colors';

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
  return (
      <View style={styles.section}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <View style={[styles.headerPill, { backgroundColor: color }]}>
            <Text style={styles.headerText}>{title}</Text>
          </View>

          <Pressable onPress={onAdd} style={styles.addButton} hitSlop={10}>
            <Text style={styles.addText}>+</Text>
          </Pressable>
        </View>

        {tasks.length === 0 ? (
            <Text style={styles.emptyText}>할 일이 없습니다</Text>
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
                        task.completed && styles.checkboxDone,
                      ]}
                  >
                    {task.completed && <Text style={styles.check}>✓</Text>}
                  </View>

                  <Text
                      style={[
                        styles.taskText,
                        task.completed && styles.doneText,
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
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.background,
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
    borderColor: colors.border,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  checkboxDone: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },

  check: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 12,
  },

  taskText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },

  doneText: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },

  emptyText: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 8,
  },

  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.add,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
    justifyContent: 'center',
  },
});