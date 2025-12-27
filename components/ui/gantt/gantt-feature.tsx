'use client';

import * as React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import type { GanttFeature } from './types';
import { getStatusColor } from './utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GanttFeatureItemProps {
  feature: GanttFeature;
  position: { left: number; width: number };
  onClick?: () => void;
  className?: string;
}

export const GanttFeatureItem = ({
  feature,
  position,
  onClick,
  className
}: GanttFeatureItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: feature.id
    });

  const style: React.CSSProperties = {
    left: position.left,
    width: position.width,
    transform: CSS.Translate.toString(transform)
  };

  const statusColor = getStatusColor(feature.status);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-grab active:cursor-grabbing',
              'flex items-center gap-1.5 px-2 text-white text-xs font-medium',
              'transition-shadow hover:shadow-md',
              statusColor,
              isDragging && 'opacity-50 shadow-lg z-50',
              className
            )}
            style={style}
            onClick={onClick}
            {...attributes}
            {...listeners}
          >
            <span className="truncate flex-1">{feature.name}</span>
            {feature.progress !== undefined && feature.progress > 0 && (
              <span className="text-[10px] opacity-80">
                {feature.progress}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1.5">
            <p className="font-semibold">{feature.name}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>
                Início:{' '}
                {format(feature.startAt, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              <p>
                Fim: {format(feature.endAt, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              {feature.assignee && <p>Responsável: {feature.assignee}</p>}
            </div>
            {feature.progress !== undefined && (
              <div className="pt-1">
                <Progress value={feature.progress} className="h-1.5" />
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

GanttFeatureItem.displayName = 'GanttFeatureItem';
