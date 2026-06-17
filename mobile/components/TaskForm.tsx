import DateTimePicker, {
  type DateTimePickerEvent
} from "@react-native-community/datetimepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  Dialog,
  HelperText,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";

import { FormTextInput } from "@/components/FormTextInput";
import {
  CATEGORY_COLOR_SWATCHES,
  DEFAULT_CATEGORY_ID,
  DEFAULT_CUSTOM_CATEGORY_COLOR
} from "@/constants/categories";
import { PRIORITY_OPTIONS } from "@/constants/priorities";
import { useTaskStore } from "@/store/taskStore";
import { radius, spacing } from "@/theme";
import type { Category, Priority, Task } from "@/types/task";
import { formatDueDate, parseIsoDate, toIsoDate } from "@/utils/date";
import { taskSchema, type TaskFormValues } from "@/utils/validation";

interface TaskFormProps {
  userId: string;
  categories: readonly Category[];
  initialTask?: Task;
  submitLabel: string;
  onSubmitTask: (values: TaskFormValues) => Promise<void> | void;
}

const getInitialCategoryId = (
  categories: readonly Category[],
  initialTask?: Task
): string => {
  if (initialTask && categories.some((category) => category.id === initialTask.categoryId)) {
    return initialTask.categoryId;
  }

  const defaultCategory = categories.find((category) => category.id === DEFAULT_CATEGORY_ID);

  return defaultCategory?.id ?? categories[0]?.id ?? DEFAULT_CATEGORY_ID;
};

export const TaskForm = ({
  userId,
  categories,
  initialTask,
  submitLabel,
  onSubmitTask
}: TaskFormProps) => {
  const theme = useTheme();
  const addCategory = useTaskStore((state) => state.addCategory);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isCategoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_CUSTOM_CATEGORY_COLOR);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const defaultValues = useMemo<TaskFormValues>(
    () => ({
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      dueDate: initialTask?.dueDate ?? toIsoDate(new Date()),
      priority: initialTask?.priority ?? "medium",
      categoryId: getInitialCategoryId(categories, initialTask)
    }),
    [categories, initialTask]
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues
  });

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      await onSubmitTask(values);
    } finally {
      setSubmitting(false);
    }
  });

  const resetCategoryDialog = () => {
    setCategoryName("");
    setSelectedColor(DEFAULT_CUSTOM_CATEGORY_COLOR);
    setCategoryError(null);
    setCategoryDialogVisible(false);
  };

  const handleCreateCategory = () => {
    const result = addCategory(userId, categoryName, selectedColor);

    if (!result.success || !result.category) {
      setCategoryError(result.message ?? "Category could not be created.");
      return;
    }

    setValue("categoryId", result.category.id, {
      shouldDirty: true,
      shouldValidate: true
    });
    resetCategoryDialog();
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setDatePickerVisible(false);
    }

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    setValue("dueDate", toIsoDate(selectedDate), {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  return (
    <>
      <View style={styles.form}>
        <FormTextInput
          control={control}
          name="title"
          label="Title"
          placeholder="Project brief, workout, study block"
          autoCapitalize="sentences"
        />
        <FormTextInput
          control={control}
          name="description"
          label="Description"
          placeholder="Add useful context"
          multiline
          numberOfLines={4}
          autoCapitalize="sentences"
          style={styles.descriptionInput}
        />

        <Controller
          control={control}
          name="dueDate"
          render={({ field: { value } }) => (
            <View>
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Due date
              </Text>
              <Button
                mode="outlined"
                icon="calendar-outline"
                contentStyle={styles.dateButtonContent}
                onPress={() => {
                  setDatePickerVisible(true);
                }}
              >
                {formatDueDate(value)}
              </Button>
              <HelperText type="error" visible={Boolean(errors.dueDate)}>
                {errors.dueDate?.message}
              </HelperText>
              {isDatePickerVisible ? (
                <DateTimePicker
                  value={parseIsoDate(value)}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={handleDateChange}
                />
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Priority
              </Text>
              <SegmentedButtons
                value={value}
                onValueChange={(nextValue) => {
                  onChange(nextValue as Priority);
                }}
                buttons={PRIORITY_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                  icon: "flag-outline"
                }))}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field: { onChange, value } }) => (
            <View>
              <View style={styles.categoryHeader}>
                <Text variant="labelLarge" style={styles.sectionLabel}>
                  Category
                </Text>
                <Button
                  icon="plus"
                  compact
                  onPress={() => {
                    setCategoryDialogVisible(true);
                  }}
                >
                  Add
                </Button>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    selected={value === category.id}
                    onPress={() => {
                      onChange(category.id);
                    }}
                    style={{ backgroundColor: `${category.color}18` }}
                  >
                    {category.name}
                  </Chip>
                ))}
              </ScrollView>
              <HelperText type="error" visible={Boolean(errors.categoryId)}>
                {errors.categoryId?.message}
              </HelperText>
            </View>
          )}
        />

        <Button
          mode="contained"
          icon="content-save-outline"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={submit}
          contentStyle={styles.submitButton}
        >
          {submitLabel}
        </Button>
      </View>

      <Portal>
        <Dialog visible={isCategoryDialogVisible} onDismiss={resetCategoryDialog}>
          <Dialog.Title>New category</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              mode="outlined"
              label="Category name"
              value={categoryName}
              onChangeText={(value) => {
                setCategoryName(value);
                setCategoryError(null);
              }}
            />
            <View style={styles.swatchRow}>
              {CATEGORY_COLOR_SWATCHES.map((color) => (
                <Button
                  key={color}
                  mode={selectedColor === color ? "contained" : "outlined"}
                  compact
                  onPress={() => {
                    setSelectedColor(color);
                  }}
                  style={[
                    styles.swatch,
                    {
                      borderColor: color,
                      backgroundColor: selectedColor === color ? color : "transparent"
                    }
                  ]}
                  labelStyle={styles.swatchLabel}
                >
                  {" "}
                </Button>
              ))}
            </View>
            {categoryError ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                {categoryError}
              </Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={resetCategoryDialog}>Cancel</Button>
            <Button onPress={handleCreateCategory}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: spacing.md
  },
  descriptionInput: {
    minHeight: 112
  },
  sectionLabel: {
    marginBottom: spacing.sm
  },
  dateButtonContent: {
    height: 48,
    justifyContent: "flex-start"
  },
  categoryHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  categoryRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  submitButton: {
    minHeight: 52
  },
  dialogContent: {
    gap: spacing.md
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  swatch: {
    borderRadius: radius.pill,
    height: 36,
    minWidth: 36,
    width: 36
  },
  swatchLabel: {
    fontSize: 0
  }
});
