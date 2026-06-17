import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Searchbar, Text, useTheme } from "react-native-paper";

import { PRIORITY_OPTIONS } from "@/constants/priorities";
import { spacing } from "@/theme";
import type { Category, FilterPriority, FilterStatus, TaskFilters } from "@/types/task";

interface TaskFiltersBarProps {
  filters: TaskFilters;
  categories: readonly Category[];
  onChange: (filters: TaskFilters) => void;
}

const STATUS_FILTERS: readonly { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" }
];

export const TaskFiltersBar = ({
  filters,
  categories,
  onChange
}: TaskFiltersBarProps) => {
  const theme = useTheme();

  const setStatus = (status: FilterStatus) => {
    onChange({ ...filters, status });
  };

  const setPriority = (priority: FilterPriority) => {
    onChange({ ...filters, priority });
  };

  const setCategory = (categoryId: string) => {
    onChange({ ...filters, categoryId });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search tasks"
        value={filters.search}
        onChangeText={(search) => {
          onChange({ ...filters, search });
        }}
        style={[styles.search, { backgroundColor: theme.colors.surface }]}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {STATUS_FILTERS.map((item) => (
          <Chip
            key={item.value}
            selected={filters.status === item.value}
            onPress={() => {
              setStatus(item.value);
            }}
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          selected={filters.priority === "all"}
          onPress={() => {
            setPriority("all");
          }}
        >
          All priority
        </Chip>
        {PRIORITY_OPTIONS.map((item) => (
          <Chip
            key={item.value}
            selected={filters.priority === item.value}
            onPress={() => {
              setPriority(item.value);
            }}
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        Category
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          selected={filters.categoryId === "all"}
          onPress={() => {
            setCategory("all");
          }}
        >
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={filters.categoryId === category.id}
            onPress={() => {
              setCategory(category.id);
            }}
            style={{ backgroundColor: `${category.color}18` }}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingBottom: spacing.md
  },
  search: {
    borderRadius: 16
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  }
});
