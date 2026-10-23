import { useState, useCallback } from 'react';
import { soundManager } from '../utils/audio';

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  const toggleSound = useCallback(() => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  }, []);

  const playClick = useCallback(() => {
    soundManager.playClick();
  }, []);

  const playNovaChirp = useCallback(() => {
    soundManager.playNovaChirp();
  }, []);

  const playWarp = useCallback(() => {
    soundManager.playWarp();
  }, []);

  const playHoloOpen = useCallback(() => {
    soundManager.playHoloOpen();
  }, []);

  return {
    isMuted,
    toggleSound,
    playClick,
    playNovaChirp,
    playWarp,
    playHoloOpen,
  };
}
