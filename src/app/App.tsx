import React, { useState, useCallback } from 'react';
import { SpaceScene } from '../features/spaceship/SpaceScene';
import { DestinationId } from '../features/spaceship/destinations';
import { projectsData, ProjectData } from '../data/projects';
import { QuickTravelBar } from '../components/navigation/QuickTravelBar';
import { DestinationHudOverlay } from '../components/navigation/DestinationHudOverlay';
import { ShipMinimap } from '../components/navigation/ShipMinimap';
import { NovaChat } from '../features/nova/NovaChat';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { WelcomeScreen } from '../components/ui/WelcomeScreen';
import { FallbackView } from '../components/ui/FallbackView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSoundEffects } from '../hooks/useSoundEffects';

type AppStage = 'loading' | 'welcome' | 'exploring';

export const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('loading');
  const [activeDestination, setActiveDestination] = useState<DestinationId>('hub');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isNovaChatOpen, setIsNovaChatOpen] = useState<boolean>(false);
  const [is2DMode, setIs2DMode] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  const prefersReducedMotion = useReducedMotion();
  const [reducedMotionManual, setReducedMotionManual] = useState<boolean | null>(null);
  const isReducedMotion = reducedMotionManual !== null ? reducedMotionManual : prefersReducedMotion;

  const { isMuted, toggleSound, playClick, playWarp, playHoloOpen } = useSoundEffects();

  const handleDestinationSelect = useCallback((dest: DestinationId) => {
    setActiveDestination(dest);
    setIsRoomDetailsOpen(false);
    if (dest !== 'hub') setAppStage('exploring');
  }, []);

  const handleOpenRoomDetails = useCallback(() => setIsRoomDetailsOpen(true), []);

  const handleOpenProject = useCallback((projectId: string) => {
    playHoloOpen();
    setSelectedProjectId(projectId);
  }, [playHoloOpen]);

  const handleCloseProject = useCallback(() => {
    playClick();
    setSelectedProjectId(null);
  }, [playClick]);

  const handleLoadingComplete = useCallback(() => {
    setAppStage('welcome');
  }, []);

  const handleExploreShip = useCallback(() => {
    playWarp();
    setActiveDestination('about');
    setAppStage('exploring');
  }, [playWarp]);

  const handleMeetNova = useCallback(() => {
    playClick();
    setAppStage('exploring');
    setIsNovaChatOpen(true);
  }, [playClick]);

  const handleNovaCharacterClick = useCallback(() => {
    setIsNovaChatOpen(true);
  }, []);

  const selectedProject: ProjectData | null = selectedProjectId
    ? projectsData.find((p) => p.id === selectedProjectId) || null
    : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 font-sans text-slate-100">
      {/* 1. Cinematic Loading Screen */}
      {appStage === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* 2. Top Navigation Bar (Always available after loading) */}
      {appStage !== 'loading' && (
        <QuickTravelBar
          activeDestination={activeDestination}
          onSelectDestination={handleDestinationSelect}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          isReducedMotion={isReducedMotion}
          onToggleReducedMotion={() => setReducedMotionManual(!isReducedMotion)}
          is2DMode={is2DMode || !hasWebGL}
          onToggle2DMode={() => setIs2DMode(!is2DMode)}
        />
      )}

      {/* 3. 3D Spaceship Canvas View */}
      {appStage !== 'loading' && !is2DMode && hasWebGL && (
        <SpaceScene
          activeDestination={activeDestination}
          onSelectDestination={handleDestinationSelect}
          onSelectProject={handleOpenProject}
          onNovaClick={handleNovaCharacterClick}
          isReducedMotion={isReducedMotion}
          onWebGLError={() => setHasWebGL(false)}
        />
      )}

      {/* 4. Conventional 2D Fallback / High-Accessibility View */}
      {appStage !== 'loading' && (is2DMode || !hasWebGL) && (
        <div className="w-full h-full overflow-y-auto">
          <FallbackView
            onOpenProject={handleOpenProject}
            onSwitchTo3D={() => setIs2DMode(false)}
            hasWebGL={hasWebGL}
          />
        </div>
      )}

      {/* 5. Destination HUD Overlay (Contextual data panel when at a specific deck in 3D mode) */}
      {appStage === 'exploring' && !is2DMode && hasWebGL && (
        <DestinationHudOverlay
          activeDestination={activeDestination}
          onSelectDestination={handleDestinationSelect}
          onOpenProject={handleOpenProject}
          isDetailsOpen={isRoomDetailsOpen}
          onSetDetailsOpen={setIsRoomDetailsOpen}
        />
      )}

      {/* 6. Ship Deck Minimap (Bottom-left in 3D mode) */}
      {appStage === 'exploring' && !is2DMode && hasWebGL && (
        <ShipMinimap
          activeDestination={activeDestination}
          onSelectDestination={handleDestinationSelect}
        />
      )}

      {/* 7. NOVA AI Robot Guide Chat Window (Bottom-right) */}
      {appStage !== 'loading' && (
        <NovaChat
          currentDestination={activeDestination}
          onNavigateDestination={handleDestinationSelect}
          onOpenProject={handleOpenProject}
          onOpenRoomDetails={handleOpenRoomDetails}
          onCloseRoomDetails={() => setIsRoomDetailsOpen(false)}
          isOpen={isNovaChatOpen}
          onToggleOpen={() => setIsNovaChatOpen(!isNovaChatOpen)}
        />
      )}

      {/* 8. Project Detail Hologram Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={handleCloseProject}
      />

      {/* 9. Cinematic Welcome Screen Modal */}
      {appStage === 'welcome' && (
        <WelcomeScreen
          onExploreShip={handleExploreShip}
          onMeetNova={handleMeetNova}
          onDismiss={handleExploreShip}
        />
      )}
    </div>
  );
};

export default App;
