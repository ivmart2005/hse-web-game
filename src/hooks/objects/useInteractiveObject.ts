import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';

interface UseInteractiveObjectProps {
  objectId: string;
  position: { x: number; y: number };
  interactionRadius: number;
  onInteract: () => void;
}

export const useInteractiveObject = ({
  position,
  interactionRadius,
  onInteract
}: UseInteractiveObjectProps) => {
  const { gameState } = useGame();
  const [isNear, setIsNear] = useState(false);

  const objectWorldX = position.x;
  const objectWorldY = position.y;
  
  const characterWorldX = -gameState.position.x;
  const characterWorldY = -gameState.position.y;

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(characterWorldX - objectWorldX, 2) + 
      Math.pow(characterWorldY - objectWorldY, 2)
    );
    setIsNear(distance < interactionRadius);
  }, [characterWorldX, characterWorldY, objectWorldX, objectWorldY, interactionRadius]);

  useEffect(() => {
    const handleInteraction = (event: KeyboardEvent) => {
      if (isNear && event.key === 'e') {
        onInteract();
      }
    };

    window.addEventListener('keydown', handleInteraction);
    return () => window.removeEventListener('keydown', handleInteraction);
  }, [isNear, onInteract]);

  return { 
    isNear, 
    canInteract: isNear 
  };
};