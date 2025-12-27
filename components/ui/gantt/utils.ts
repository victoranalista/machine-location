import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInQuarters,
  differenceInWeeks,
  differenceInYears,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  isToday,
  isSameDay,
  isWeekend
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GanttRange, GanttFeature } from './types';

const COLUMN_WIDTHS: Record<GanttRange, number> = {
  daily: 40,
  weekly: 100,
  monthly: 150,
  quarterly: 200,
  yearly: 300
};

export const getColumnWidth = (range: GanttRange): number =>
  COLUMN_WIDTHS[range];

export const getDateRange = (date: Date, range: GanttRange) => {
  const configs: Record<GanttRange, { start: Date; end: Date }> = {
    daily: { start: startOfDay(date), end: endOfDay(date) },
    weekly: {
      start: startOfWeek(date, { locale: ptBR }),
      end: endOfWeek(date, { locale: ptBR })
    },
    monthly: { start: startOfMonth(date), end: endOfMonth(date) },
    quarterly: { start: startOfQuarter(date), end: endOfQuarter(date) },
    yearly: { start: startOfYear(date), end: endOfYear(date) }
  };
  return configs[range];
};

export const getUnitsInRange = (
  start: Date,
  end: Date,
  range: GanttRange
): number => {
  const diffFns: Record<GanttRange, (end: Date, start: Date) => number> = {
    daily: differenceInDays,
    weekly: differenceInWeeks,
    monthly: differenceInMonths,
    quarterly: differenceInQuarters,
    yearly: differenceInYears
  };
  return diffFns[range](end, start) + 1;
};

export const addUnits = (
  date: Date,
  units: number,
  range: GanttRange
): Date => {
  const addFns: Record<GanttRange, (date: Date, amount: number) => Date> = {
    daily: addDays,
    weekly: addWeeks,
    monthly: addMonths,
    quarterly: addQuarters,
    yearly: addYears
  };
  return addFns[range](date, units);
};

export const getStartOfUnit = (date: Date, range: GanttRange): Date => {
  const startFns: Record<GanttRange, (date: Date) => Date> = {
    daily: startOfDay,
    weekly: (d) => startOfWeek(d, { locale: ptBR }),
    monthly: startOfMonth,
    quarterly: startOfQuarter,
    yearly: startOfYear
  };
  return startFns[range](date);
};

export const formatColumnDate = (date: Date, range: GanttRange): string => {
  const formats: Record<GanttRange, string> = {
    daily: 'dd',
    weekly: "'S'w",
    monthly: 'MMM',
    quarterly: 'QQQ yyyy',
    yearly: 'yyyy'
  };
  return format(date, formats[range], { locale: ptBR });
};

export const formatHeaderDate = (date: Date, range: GanttRange): string => {
  const formats: Record<GanttRange, string> = {
    daily: 'MMMM yyyy',
    weekly: 'MMMM yyyy',
    monthly: 'yyyy',
    quarterly: 'yyyy',
    yearly: "'Década'"
  };
  return format(date, formats[range], { locale: ptBR });
};

export const getFeaturePosition = (
  feature: GanttFeature,
  timelineStart: Date,
  range: GanttRange,
  columnWidth: number
): { left: number; width: number } => {
  const startOffset = differenceInDays(feature.startAt, timelineStart);
  const duration = differenceInDays(feature.endAt, feature.startAt) + 1;

  const daysPerUnit =
    range === 'daily'
      ? 1
      : range === 'weekly'
        ? 7
        : range === 'monthly'
          ? 30
          : range === 'quarterly'
            ? 90
            : 365;

  const left = (startOffset / daysPerUnit) * columnWidth;
  const width = Math.max(
    (duration / daysPerUnit) * columnWidth,
    columnWidth * 0.5
  );

  return { left, width };
};

export const dateFromPosition = (
  positionX: number,
  timelineStart: Date,
  range: GanttRange,
  columnWidth: number
): Date => {
  const daysPerUnit =
    range === 'daily'
      ? 1
      : range === 'weekly'
        ? 7
        : range === 'monthly'
          ? 30
          : range === 'quarterly'
            ? 90
            : 365;

  const units = positionX / columnWidth;
  const days = Math.round(units * daysPerUnit);
  return addDays(timelineStart, days);
};

export const generateTimelineColumns = (
  start: Date,
  count: number,
  range: GanttRange
): Date[] => {
  return Array.from({ length: count }, (_, i) => addUnits(start, i, range));
};

export const isTodayColumn = (date: Date, range: GanttRange): boolean => {
  if (range === 'daily') return isToday(date);
  const { start, end } = getDateRange(date, range);
  const today = new Date();
  return today >= start && today <= end;
};

export const isWeekendColumn = (date: Date): boolean => isWeekend(date);

export const getStatusColor = (status?: string): string => {
  const colors: Record<string, string> = {
    done: 'bg-emerald-500 hover:bg-emerald-600',
    'in-progress': 'bg-blue-500 hover:bg-blue-600',
    todo: 'bg-amber-500 hover:bg-amber-600',
    backlog: 'bg-slate-500 hover:bg-slate-600',
    cancelled: 'bg-rose-500 hover:bg-rose-600'
  };
  return colors[status ?? 'todo'] ?? 'bg-primary hover:bg-primary/90';
};
