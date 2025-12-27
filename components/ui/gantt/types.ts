export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status?: GanttFeatureStatus;
  progress?: number;
  assignee?: string;
  dependencies?: string[];
};

export type GanttFeatureStatus =
  | 'done'
  | 'in-progress'
  | 'todo'
  | 'backlog'
  | 'cancelled';

export type GanttRange =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export type GanttMarker = {
  id: string;
  date: Date;
  label: string;
  className?: string;
};

export type GanttGroupedFeatures = {
  [groupId: string]: {
    name: string;
    features: GanttFeature[];
  };
};
