export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Keys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

export type Direction = 'left' | 'right';

export interface CharacterState {
  position: Position;
  velocity: Velocity;
  direction: Direction;
  isWalking: boolean;
  currentFrame: number;
}

export interface GameScale {
  scale: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export interface CollisionSystem {
  checkCollision: (x: number, y: number) => boolean;
  isLoaded: boolean;
}

export interface AnimationConfig {
  frames: number[];
  frameDuration: number;
  loop: boolean;
}