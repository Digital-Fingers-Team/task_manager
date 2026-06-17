import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  dismissLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  dismissLabel = "Cancel",
  isDestructive = false,
  loading = false,
  onDismiss,
  onConfirm
}: ConfirmDialogProps) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{message}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss} disabled={loading}>
          {dismissLabel}
        </Button>
        <Button
          onPress={onConfirm}
          loading={loading}
          textColor={isDestructive ? "#DC2626" : undefined}
        >
          {confirmLabel}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);
