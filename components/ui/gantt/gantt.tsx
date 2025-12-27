'use client';

import * as React from 'react';
import { Provider } from 'jotai';
import { cn } from '@/lib/utils';
import type {
  GanttFeature,
  GanttGroupedFeatures,
  GanttRange,
  GanttMarker
} from './types';
import { GanttSidebar } from './gantt-sidebar';
import { GanttTimeline } from './gantt-timeline';
import { GanttHeader } from './gantt-header';

export interface GanttProps {
  features: GanttFeature[] | GanttGroupedFeatures;
  markers?: GanttMarker[];
  range?: GanttRange;
  onFeatureUpdate?: (feature: GanttFeature) => void;
  onFeatureClick?: (feature: GanttFeature) => void;
  className?: string;
  sidebarEnabled?: boolean;
  headerEnabled?: boolean;
  todayMarker?: boolean;
}

const isGroupedFeatures = (
  features: GanttFeature[] | GanttGroupedFeatures
): features is GanttGroupedFeatures => {
  return !Array.isArray(features);
};

const GanttContent = ({
  features,
  markers = [],
  range: initialRange = 'monthly',
  onFeatureUpdate,
  onFeatureClick,
  className,
  sidebarEnabled = true,
  headerEnabled = true,
  todayMarker = true
}: GanttProps) => {
  const [range, setRange] = React.useState<GanttRange>(initialRange);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const flatFeatures = React.useMemo(() => {
    if (isGroupedFeatures(features)) {
      return Object.values(features).flatMap((group) => group.features);
    }
    return features;
  }, [features]);

  const groups = React.useMemo(() => {
    if (isGroupedFeatures(features)) {
      return Object.entries(features).map(([id, group]) => ({
        id,
        name: group.name,
        features: group.features
      }));
    }
    return [{ id: 'default', name: '', features }];
  }, [features]);

  const dateRange = React.useMemo(() => {
    if (flatFeatures.length === 0) {
      const now = new Date();
      return { start: now, end: now };
    }

    const dates = flatFeatures.flatMap((f) => [f.startAt, f.endAt]);
    return {
      start: new Date(Math.min(...dates.map((d) => d.getTime()))),
      end: new Date(Math.max(...dates.map((d) => d.getTime())))
    };
  }, [flatFeatures]);

  const allMarkers = React.useMemo(() => {
    const result = [...markers];
    if (todayMarker) {
      result.push({
        id: 'today',
        date: new Date(),
        label: 'Hoje',
        className: 'bg-red-500'
      });
    }
    return result;
  }, [markers, todayMarker]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col rounded-lg border bg-background overflow-hidden',
        className
      )}
    >
      {headerEnabled && (
        <GanttHeader
          range={range}
          onRangeChange={setRange}
          dateRange={dateRange}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {sidebarEnabled && (
          <GanttSidebar groups={groups} onFeatureClick={onFeatureClick} />
        )}
        <GanttTimeline
          groups={groups}
          range={range}
          dateRange={dateRange}
          markers={allMarkers}
          onFeatureUpdate={onFeatureUpdate}
          onFeatureClick={onFeatureClick}
        />
      </div>
    </div>
  );
};

export const Gantt = (props: GanttProps) => (
  <Provider>
    <GanttContent {...props} />
  </Provider>
);

Gantt.displayName = 'Gantt';
