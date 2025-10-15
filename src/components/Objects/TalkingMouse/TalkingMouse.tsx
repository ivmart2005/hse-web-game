import React from 'react';
import InteractiveObject from '../InteractiveObject/InteractiveObject';
import './TalkingMouse.css';

interface TalkingMouseProps {
  position?: { x: number; y: number };
  onTalk?: () => void;
}

export const TalkingMouse: React.FC<TalkingMouseProps> = ({ 
  position = { x: 300, y: 200 },
  onTalk = () => console.log("Пи-пи! Я говорящая мышь!")
}) => {
  return (
    <InteractiveObject
      id="talking_mouse_1"
      type="npc"
      position={position}
      sprite="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23ff6b6b' rx='10'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='20'%3E🐭%3C/text%3E%3C/svg%3E"
      interactionRadius={60}
      onInteract={onTalk}
      hintText="Поговорить с мышью"
    >
      {/* Теперь это функция, а не JSX */}
      {(isNear: boolean) => (
        <div 
          className="mouse-debug-background"
          style={{
            position: 'absolute',
            top: '-30px',
            left: '-30px',
            width: '110px',
            height: '110px',
            backgroundColor: isNear ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.2)',
            border: `2px dashed ${isNear ? 'green' : 'red'}`,
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: -1,
            transition: 'all 0.3s ease'
          }}
        />
      )}
    </InteractiveObject>
  );
};

export default TalkingMouse;