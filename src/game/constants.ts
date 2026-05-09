export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30; // Pixel size of each block

export const COLORS = [
  '#000000', // 0: Empty
  '#00FFFF', // 1: Cyan (I)
  '#0000FF', // 2: Blue (J)
  '#FFA500', // 3: Orange (L)
  '#FFFF00', // 4: Yellow (O)
  '#00FF00', // 5: Green (S)
  '#800080', // 6: Purple (T)
  '#FF0000', // 7: Red (Z)
  '#FFFFFF', // 8: Food/Ghost
];

// Tetromino Shapes defined as arrays of relative coordinates and a pivot
export const SHAPES = [
  [], // Empty
  [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // I
  [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }], // J
  [{ x: 1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }], // L
  [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }], // O
  [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }], // S
  [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }], // T
  [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }], // Z
];

export interface GameState {
  score: number;
  lines: number;
  level: number;
  isGameOver: boolean;
  isPlaying: boolean;
}
