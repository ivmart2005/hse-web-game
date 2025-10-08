import { useState, useEffect, useRef } from 'react';
import type { Keys } from '../../types';
import { KEY_MAPPINGS, PREVENT_DEFAULT_KEYS } from '../../constants';

export const useKeyboardControls = () => {
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const keys = useRef<Keys>({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (PREVENT_DEFAULT_KEYS.includes(event.key as any)) {
        event.preventDefault();
      }

      const key = event.key.toLowerCase();

      if (KEY_MAPPINGS.RIGHT.includes(key as any)) {
        keys.current.d = true;
        setDirection('right');
      } else if (KEY_MAPPINGS.LEFT.includes(key as any)) {
        keys.current.a = true;
        setDirection('left');
      } else if (KEY_MAPPINGS.DOWN.includes(key as any)) {
        keys.current.s = true;
        keys.current.w = false;
      } else if (KEY_MAPPINGS.UP.includes(key as any)) {
        keys.current.w = true;
        keys.current.s = false;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (KEY_MAPPINGS.RIGHT.includes(key as any)) {
        keys.current.d = false;
      } else if (KEY_MAPPINGS.LEFT.includes(key as any)) {
        keys.current.a = false;
      } else if (KEY_MAPPINGS.DOWN.includes(key as any)) {
        keys.current.s = false;
      } else if (KEY_MAPPINGS.UP.includes(key as any)) {
        keys.current.w = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { keys: keys.current, direction, setDirection };
};