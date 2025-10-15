import React from 'react';
import { useInteractiveObject } from '../../../hooks/objects/useInteractiveObject';
import { useGame } from '../../../contexts/GameContext';
import './InteractiveObject.css';

interface InteractiveObjectProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  sprite: string;
  interactionRadius: number;
  onInteract: () => void;
  showHint?: boolean;
  hintText?: string;
  children?: React.ReactNode | ((isNear: boolean) => React.ReactNode);
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  id,
  type,
  position,
  sprite,
  interactionRadius,
  onInteract,
  showHint = true,
  hintText = 'Нажми E',
  children
}) => {
  const { gameState } = useGame();
  const { isNear, canInteract } = useInteractiveObject({
    objectId: id,
    position,
    interactionRadius,
    onInteract
  });

  // Компенсация движения фона
  const objectScreenX = position.x + gameState.position.x;
  const objectScreenY = position.y + gameState.position.y;

  return (
    <div 
      className={`interactive-object interactive-object--${type}`}
      style={{ 
        position: 'absolute',
        left: objectScreenX,
        top: objectScreenY,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src={sprite} 
        alt={id} 
        className="interactive-object__sprite"
      />
      
      {/* Поддержка render prop */}
      {children && typeof children === 'function' ? children(isNear) : children}
      
      {isNear && showHint && canInteract && (
        <div className="interactive-object__hint">
          {hintText}
        </div>
      )}
    </div>
  );
};

export default InteractiveObject;