import { DestinationId } from './destinations';

export interface SceneInteractionState {
  activeDestination: DestinationId;
  targetDestination: DestinationId;
  isTransitioning: boolean;
  selectedProjectId: string | null;
  hoveredObject: string | null;
  qualityLevel: 'high' | 'medium' | 'low';
}
