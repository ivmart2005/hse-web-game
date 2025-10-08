export const KEY_MAPPINGS = {
  RIGHT: ['arrowright', 'd', 'в'] as const,
  LEFT: ['arrowleft', 'a', 'ф'] as const,
  DOWN: ['arrowdown', 's', 'ы'] as const,
  UP: ['arrowup', 'w', 'ц'] as const
} as const;

export const PREVENT_DEFAULT_KEYS = [
  'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp',
  'd', 'a', 's', 'w', 'в', 'ы', 'ф', 'ц'
] as const;