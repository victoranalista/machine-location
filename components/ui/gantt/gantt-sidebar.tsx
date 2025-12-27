'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GanttFeature } from './types';
import { getStatusColor } from './utils';

interface GanttGroup {
  id: string;
  name: string;
  features: GanttFeature[];
}

interface GanttSidebarProps {
  groups: GanttGroup[];
  onFeatureClick?: (feature: GanttFeature) => void;
  className?: string;
}

const ROW_HEIGHT = 40;
const GROUP_HEADER_HEIGHT = 32;

export const GanttSidebar = ({
  groups,
  onFeatureClick,
  className
}: GanttSidebarProps) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-[280px] border-r bg-background',
        className
      )}
    >
      <div className="h-10 flex items-center px-4 border-b bg-muted/40">
        <span className="text-sm font-medium text-muted-foreground">
          Tarefas
        </span>
      </div>

      <ScrollArea className="h-[calc(100%-40px)]">
        {groups.map((group) => (
          <div key={group.id}>
            {group.name && (
              <div
                className="flex items-center px-4 bg-muted/20 border-b"
                style={{ height: GROUP_HEADER_HEIGHT }}
              >
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {group.name}
                </span>
              </div>
            )}

            {group.features.map((feature) => (
              <div
                key={feature.id}
                className={cn(
                  'flex items-center gap-3 px-4 border-b hover:bg-muted/50 cursor-pointer transition-colors',
                  'group'
                )}
                style={{ height: ROW_HEIGHT }}
                onClick={() => onFeatureClick?.(feature)}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    getStatusColor(feature.status)
                  )}
                />
                <span className="text-sm truncate flex-1">{feature.name}</span>
                {feature.progress !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {feature.progress}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

GanttSidebar.displayName = 'GanttSidebar';
