import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Task } from '../types';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  color: string;
  tasks: Task[];
  onToggle?: (id: number) => void;
};

export default function TaskSection({
                                      title,
                                      color,
                                      tasks,
                                      onToggle,
                                    }: Props) {
  return (
      <View style={styles.section}>
        <View style={[styles.headerPill, { backgroundColor: color }]}>
          <Text style={styles.headerText}>{title}</Text>
        </View>

        {tasks.length === 0 ? (
            <Text style={styles.emptyText}>오늘 할 일이 없습니다</Text>
        ) : (
            tasks.map((task, index) => (
                <Pressable
                    style={[
                      styles.taskRow,
                      index === tasks.length - 1 && { marginBottom: 0 }
                    ]}
                    key={task.id}
                    onPress={() => onToggle?.(task.id)}
                >
                  <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                    {task.completed && <Text style={styles.check}>✓</Text>}
                  </View>

                  <Text style={[styles.taskText, task.completed && styles.doneText]}>
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
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  headerPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },

  headerText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '800',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d7d7d7',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDone: {
    backgroundColor: '#7f7f7f',
    borderColor: '#7f7f7f',
  },

  check: {
    color: '#fff',
    fontWeight: '800',
  },

  taskText: {
    color: colors.text,
    fontSize: 18,
    flex: 1,
  },

  doneText: {
    color: '#7e7e7e',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  }
});