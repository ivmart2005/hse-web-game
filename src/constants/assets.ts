export const ASSET_PATHS = {
  BACKGROUND: '/assets/images/background.png',
  BACKGROUND_MASK: '/assets/images/background_mask.png',
  CHARACTER: {
    STATIC: '/assets/images/walk_animation/static.png',
    FRAME: (frameIndex: number) => `/assets/images/walk_animation/${frameIndex}.png`
  }
} as const;