'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { GanttRange, GanttMarker } from './types';
import {
  formatColumnDate,
  formatHeaderDate,
  isTodayColumn,
  isWeekendColumn
} from './utils';

interface GanttColumnsProps {
  columns: Date[];
  range: GanttRange;
  columnWidth: number;
  markers?: GanttMarker[];
  timelineStart: Date;
  className?: string;
}

export const GanttColumns = ({
  columns,
  range,
  columnWidth,
  className
}: GanttColumnsProps) => {
  const headerGroups = React.useMemo(() => {
    const groups: { date: Date; label: string; span: number }[] = [];
    let currentLabel = '';

    columns.forEach((col) => {
      const label = formatHeaderDate(col, range);
      if (label !== currentLabel) {
        groups.push({ date: col, label, span: 1 });
        currentLabel = label;
      } else {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup) lastGroup.span++;
      }
    });

    return groups;
  }, [columns, range]);

  return (
    <div className={cn('sticky top-0 z-20 bg-background', className)}>
      <div className="flex border-b bg-muted/40" style={{ height: 24 }}>
        {headerGroups.map((group, i) => (
          <div
            key={i}
            className="flex items-center justify-center border-r text-xs font-medium text-muted-foreground"
            style={{ width: group.span * columnWidth }}
          >
            {group.label}
          </div>
        ))}
      </div>

      <div className="flex border-b" style={{ height: 28 }}>
        {columns.map((col, i) => {
          const isToday = isTodayColumn(col, range);
          const isWeekend = range === 'daily' && isWeekendColumn(col);

          return (
            <div
              key={i}
              className={cn(
                'flex items-center justify-center border-r text-xs',
                isToday && 'bg-primary/10 font-semibold text-primary',
                isWeekend && !isToday && 'bg-muted/50 text-muted-foreground'
              )}
              style={{ width: columnWidth }}
            >
              {formatColumnDate(col, range)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

GanttColumns.displayName = 'GanttColumns';
