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

  // Позиция объекта в мировых координатах
  const objectWorldX = position.x;
  const objectWorldY = position.y;
  
  // Позиция персонажа в мировых координатах
  // Персонаж всегда в центре экрана, поэтому его мировые координаты = -позиция фона
  const characterWorldX = -gameState.position.x;
  const characterWorldY = -gameState.position.y;

  // Проверяем расстояние в мировых координатах
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(characterWorldX - objectWorldX, 2) + 
      Math.pow(characterWorldY - objectWorldY, 2)
    );
    setIsNear(distance < interactionRadius);
  }, [characterWorldX, characterWorldY, objectWorldX, objectWorldY, interactionRadius]);

  // Обрабатываем взаимодействие
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