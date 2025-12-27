'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GanttRange } from './types';

interface GanttHeaderProps {
  range: GanttRange;
  onRangeChange: (range: GanttRange) => void;
  dateRange: { start: Date; end: Date };
  className?: string;
}

const rangeOptions: { value: GanttRange; label: string }[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' }
];

export const GanttHeader = ({
  range,
  onRangeChange,
  dateRange,
  className
}: GanttHeaderProps) => {
  const formatRange = () => {
    const start = format(dateRange.start, 'dd MMM yyyy', { locale: ptBR });
    const end = format(dateRange.end, 'dd MMM yyyy', { locale: ptBR });
    return `${start} - ${end}`;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b bg-muted/40 px-4 py-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{formatRange()}</span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={range}
          onValueChange={(v) => onRangeChange(v as GanttRange)}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rangeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            Hoje
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

GanttHeader.displayName = 'GanttHeader';
