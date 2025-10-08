import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import type { Keys } from '../../types';
import { KEY_MAPPINGS, PREVENT_DEFAULT_KEYS } from '../../constants';

export const useKeyboardControls = () => {
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const { setGameState } = useGame();
  const keysRef = useRef<Keys>({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (PREVENT_DEFAULT_KEYS.includes(event.key as any)) {
        event.preventDefault();
      }

      const key = event.key.toLowerCase();
      const newKeys = { ...keysRef.current };

      if (KEY_MAPPINGS.RIGHT.includes(key as any)) {
        newKeys.d = true;
        setDirection('right');
      } else if (KEY_MAPPINGS.LEFT.includes(key as any)) {
        newKeys.a = true;
        setDirection('left');
      } else if (KEY_MAPPINGS.DOWN.includes(key as any)) {
        newKeys.s = true;
        newKeys.w = false;
      } else if (KEY_MAPPINGS.UP.includes(key as any)) {
        newKeys.w = true;
        newKeys.s = false;
      }

      keysRef.current = newKeys;
      setGameState(prev => ({
        ...prev,
        keys: newKeys
      }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const newKeys = { ...keysRef.current };

      if (KEY_MAPPINGS.RIGHT.includes(key as any)) {
        newKeys.d = false;
      } else if (KEY_MAPPINGS.LEFT.includes(key as any)) {
        newKeys.a = false;
      } else if (KEY_MAPPINGS.DOWN.includes(key as any)) {
        newKeys.s = false;
      } else if (KEY_MAPPINGS.UP.includes(key as any)) {
        newKeys.w = false;
      }

      keysRef.current = newKeys;
      setGameState(prev => ({
        ...prev,
        keys: newKeys
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setGameState]);

  return { 
    keys: keysRef.current, 
    direction, 
    setDirection 
  };
};