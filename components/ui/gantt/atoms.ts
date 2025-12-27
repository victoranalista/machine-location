import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { GanttRange } from './types';

const rangeAtom = atomWithStorage<GanttRange>('gantt-range', 'monthly');
const sidebarWidthAtom = atom<number>(300);
const timelineDateAtom = atom<Date>(new Date());
const draggingFeatureAtom = atom<string | null>(null);
const resizingFeatureAtom = atom<string | null>(null);
const selectedFeatureAtom = atom<string | null>(null);

export const useGanttRange = () => useAtom(rangeAtom);
export const useGanttRangeValue = () => useAtomValue(rangeAtom);
export const useSetGanttRange = () => useSetAtom(rangeAtom);

export const useSidebarWidth = () => useAtom(sidebarWidthAtom);
export const useSidebarWidthValue = () => useAtomValue(sidebarWidthAtom);
export const useSetSidebarWidth = () => useSetAtom(sidebarWidthAtom);

export const useTimelineDate = () => useAtom(timelineDateAtom);
export const useTimelineDateValue = () => useAtomValue(timelineDateAtom);
export const useSetTimelineDate = () => useSetAtom(timelineDateAtom);

export const useDraggingFeature = () => useAtom(draggingFeatureAtom);
export const useDraggingFeatureValue = () => useAtomValue(draggingFeatureAtom);
export const useSetDraggingFeature = () => useSetAtom(draggingFeatureAtom);

export const useResizingFeature = () => useAtom(resizingFeatureAtom);
export const useResizingFeatureValue = () => useAtomValue(resizingFeatureAtom);
export const useSetResizingFeature = () => useSetAtom(resizingFeatureAtom);

export const useSelectedFeature = () => useAtom(selectedFeatureAtom);
export const useSelectedFeatureValue = () => useAtomValue(selectedFeatureAtom);
export const useSetSelectedFeature = () => useSetAtom(selectedFeatureAtom);
