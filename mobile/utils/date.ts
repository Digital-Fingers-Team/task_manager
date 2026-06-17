import { format, isSameDay, isValid, parseISO } from "date-fns";

export const toIsoDate = (date: Date): string => date.toISOString();

export const parseIsoDate = (isoDate: string): Date => {
  const parsed = parseISO(isoDate);

  return isValid(parsed) ? parsed : new Date();
};

export const formatDueDate = (isoDate: string): string => {
  const parsed = parseIsoDate(isoDate);

  return format(parsed, "MMM d, yyyy");
};

export const formatLongDate = (isoDate: string): string => {
  const parsed = parseIsoDate(isoDate);

  return format(parsed, "EEEE, MMMM d, yyyy");
};

export const isTodayIsoDate = (isoDate: string): boolean =>
  isSameDay(parseIsoDate(isoDate), new Date());

export const getDueTone = (isoDate: string, isCompleted: boolean): "normal" | "today" | "overdue" => {
  if (isCompleted) {
    return "normal";
  }

  const dueDate = parseIsoDate(isoDate);
  const today = new Date();

  if (isSameDay(dueDate, today)) {
    return "today";
  }

  return dueDate.getTime() < today.setHours(0, 0, 0, 0) ? "overdue" : "normal";
};
