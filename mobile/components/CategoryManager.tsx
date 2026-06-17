import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  CATEGORY_COLOR_SWATCHES,
  DEFAULT_CUSTOM_CATEGORY_COLOR
} from "@/constants/categories";
import { useTaskStore } from "@/store/taskStore";
import { radius, spacing } from "@/theme";
import type { Category } from "@/types/task";

interface CategoryManagerProps {
  userId: string;
  categories: readonly Category[];
}

export const CategoryManager = ({ userId, categories }: CategoryManagerProps) => {
  const theme = useTheme();
  const addCategory = useTaskStore((state) => state.addCategory);
  const deleteCategory = useTaskStore((state) => state.deleteCategory);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_CUSTOM_CATEGORY_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const resetDialog = () => {
    setCategoryName("");
    setSelectedColor(DEFAULT_CUSTOM_CATEGORY_COLOR);
    setError(null);
    setDialogVisible(false);
  };

  const handleCreate = () => {
    const result = addCategory(userId, categoryName, selectedColor);

    if (!result.success) {
      setError(result.message ?? "Category could not be created.");
      return;
    }

    resetDialog();
  };

  const handleDelete = () => {
    if (!pendingDelete) {
      return;
    }

    const result = deleteCategory(userId, pendingDelete.id);

    if (!result.success) {
      setError(result.message ?? "Category could not be deleted.");
    }

    setPendingDelete(null);
  };

  return (
    <>
      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title
          title="Categories"
          subtitle="Default and custom task groups"
          right={(props) => (
            <IconButton
              {...props}
              icon="plus"
              onPress={() => {
                setDialogVisible(true);
              }}
            />
          )}
        />
        <Card.Content style={styles.content}>
          {categories.map((category, index) => (
            <View key={category.id}>
              <View style={styles.categoryRow}>
                <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                <View style={styles.categoryText}>
                  <Text variant="titleSmall">{category.name}</Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {category.isDefault ? "Default" : "Custom"}
                  </Text>
                </View>
                <IconButton
                  icon="delete-outline"
                  disabled={category.isDefault}
                  onPress={() => {
                    setPendingDelete(category);
                  }}
                />
              </View>
              {index < categories.length - 1 ? <Divider /> : null}
            </View>
          ))}
          {error ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {error}
            </Text>
          ) : null}
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={resetDialog}>
          <Dialog.Title>New category</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              mode="outlined"
              label="Category name"
              value={categoryName}
              onChangeText={(value) => {
                setCategoryName(value);
                setError(null);
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
            {error ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                {error}
              </Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={resetDialog}>Cancel</Button>
            <Button onPress={handleCreate}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ConfirmDialog
        visible={Boolean(pendingDelete)}
        title="Delete category"
        message="Tasks in this category will move to Personal."
        confirmLabel="Delete"
        isDestructive
        onDismiss={() => {
          setPendingDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg
  },
  content: {
    gap: spacing.sm
  },
  categoryRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 56
  },
  colorDot: {
    borderRadius: 7,
    height: 14,
    marginRight: spacing.md,
    width: 14
  },
  categoryText: {
    flex: 1
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
