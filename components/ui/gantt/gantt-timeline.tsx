'use client';

import * as React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { GanttFeature, GanttRange, GanttMarker } from './types';
import { GanttFeatureItem } from './gantt-feature';
import { GanttColumns } from './gantt-columns';
import {
  getColumnWidth,
  generateTimelineColumns,
  getFeaturePosition,
  dateFromPosition,
  addUnits,
  getStartOfUnit,
  getUnitsInRange
} from './utils';
import { differenceInDays, addDays } from 'date-fns';

interface GanttGroup {
  id: string;
  name: string;
  features: GanttFeature[];
}

interface GanttTimelineProps {
  groups: GanttGroup[];
  range: GanttRange;
  dateRange: { start: Date; end: Date };
  markers?: GanttMarker[];
  onFeatureUpdate?: (feature: GanttFeature) => void;
  onFeatureClick?: (feature: GanttFeature) => void;
  className?: string;
}

const ROW_HEIGHT = 40;
const GROUP_HEADER_HEIGHT = 32;
const PADDING_UNITS = 2;

export const GanttTimeline = ({
  groups,
  range,
  dateRange,
  markers = [],
  onFeatureUpdate,
  onFeatureClick,
  className
}: GanttTimelineProps) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const columnWidth = getColumnWidth(range);

  const timelineStart = React.useMemo(
    () =>
      addUnits(getStartOfUnit(dateRange.start, range), -PADDING_UNITS, range),
    [dateRange.start, range]
  );

  const timelineEnd = React.useMemo(
    () => addUnits(getStartOfUnit(dateRange.end, range), PADDING_UNITS, range),
    [dateRange.end, range]
  );

  const columnCount = React.useMemo(
    () => getUnitsInRange(timelineStart, timelineEnd, range),
    [timelineStart, timelineEnd, range]
  );

  const columns = React.useMemo(
    () => generateTimelineColumns(timelineStart, columnCount, range),
    [timelineStart, columnCount, range]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const flatFeatures = React.useMemo(
    () => groups.flatMap((g) => g.features),
    [groups]
  );

  const activeFeature = activeId
    ? flatFeatures.find((f) => f.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setActiveId(null);

    if (!delta.x || !onFeatureUpdate) return;

    const feature = flatFeatures.find((f) => f.id === active.id);
    if (!feature) return;

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

    const daysMoved = Math.round((delta.x / columnWidth) * daysPerUnit);
    if (daysMoved === 0) return;

    onFeatureUpdate({
      ...feature,
      startAt: addDays(feature.startAt, daysMoved),
      endAt: addDays(feature.endAt, daysMoved)
    });
  };

  const totalWidth = columnCount * columnWidth;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn('flex-1 overflow-hidden', className)}>
        <ScrollArea className="h-full" ref={containerRef}>
          <div style={{ width: totalWidth, minWidth: '100%' }}>
            <GanttColumns
              columns={columns}
              range={range}
              columnWidth={columnWidth}
              markers={markers}
              timelineStart={timelineStart}
            />

            <div className="relative">
              {groups.map((group) => (
                <div key={group.id}>
                  {group.name && (
                    <div
                      className="bg-muted/20 border-b"
                      style={{ height: GROUP_HEADER_HEIGHT }}
                    />
                  )}

                  {group.features.map((feature) => {
                    const position = getFeaturePosition(
                      feature,
                      timelineStart,
                      range,
                      columnWidth
                    );

                    return (
                      <div
                        key={feature.id}
                        className="relative border-b"
                        style={{ height: ROW_HEIGHT }}
                      >
                        <GanttFeatureItem
                          feature={feature}
                          position={position}
                          onClick={() => onFeatureClick?.(feature)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}

              {markers.map((marker) => {
                const dayOffset = differenceInDays(marker.date, timelineStart);
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
                const left = (dayOffset / daysPerUnit) * columnWidth;

                return (
                  <div
                    key={marker.id}
                    className={cn(
                      'absolute top-0 bottom-0 w-0.5 z-10',
                      marker.className ?? 'bg-red-500'
                    )}
                    style={{ left }}
                  />
                );
              })}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DragOverlay>
        {activeFeature && (
          <div
            className={cn(
              'h-7 rounded-md px-2 py-1 text-xs font-medium text-white shadow-lg',
              'flex items-center opacity-80',
              'bg-primary'
            )}
          >
            {activeFeature.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

GanttTimeline.displayName = 'GanttTimeline';
