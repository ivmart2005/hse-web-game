export const GAME_CONFIG = {
  WIDTH: 1600,
  HEIGHT: 600,
  BACKGROUND: {
    INITIAL_X: -180,
    INITIAL_Y: -250
  },
  CHARACTER: {
    WIDTH: 280,
    HEIGHT: 460,
    SHADOW: {
      WIDTH: 210,
      HEIGHT: 80,
      OFFSET_Y: 10
    }
  }
} as const;