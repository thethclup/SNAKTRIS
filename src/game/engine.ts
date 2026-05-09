import { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, SHAPES, GameState } from './constants';

export type Point = { x: number, y: number };
export type Block = { colorIndex: number };
export type Grid = (Block | null)[][];
export type Piece = { shape: Point[], x: number, y: number, colorIndex: number };

const getEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

function getRandomPiece(): Piece {
  const type = Math.floor(Math.random() * 7) + 1;
  const shape = JSON.parse(JSON.stringify(SHAPES[type]));
  return { shape, x: Math.floor(COLS / 2), y: 1, colorIndex: type };
}

export function useGameEngine() {
  const [grid, setGrid] = useState<Grid>(getEmptyGrid());
  const [piece, setPiece] = useState<Piece | null>(null);
  const [nextPieceIndex, setNextPiece] = useState<number>(1);
  const [food, setFood] = useState<Point | null>(null);
  const [gameState, setGameState] = useState<GameState>({ score: 0, lines: 0, level: 1, isGameOver: false, isPlaying: false });
  const [snakeLength, setSnakeLength] = useState(4);
  const [combo, setCombo] = useState(1);

  const spawnFood = useCallback((currentGrid: Grid) => {
    let emptyCells = [];
    for(let y=0; y<ROWS; y++) {
      for(let x=0; x<COLS; x++) {
        if (!currentGrid[y][x]) emptyCells.push({x, y});
      }
    }
    if(emptyCells.length > 0) {
      const i = Math.floor(Math.random() * emptyCells.length);
      setFood(emptyCells[i]);
    }
  }, []);

  const startGame = useCallback(() => {
    const emptyGrid = getEmptyGrid();
    setGrid(emptyGrid);
    setGameState({ score: 0, lines: 0, level: 1, isGameOver: false, isPlaying: true });
    setPiece(getRandomPiece());
    setNextPiece(Math.floor(Math.random() * 7) + 1);
    setSnakeLength(4);
    setCombo(1);
    spawnFood(emptyGrid);
  }, [spawnFood]);

  const stateRef = useRef({ grid, piece, gameState, snakeLength, combo, food, nextPieceIndex });
  stateRef.current = { grid, piece, gameState, snakeLength, combo, food, nextPieceIndex };

  const movePiece = useCallback((dx: number, dy: number, rotate: boolean) => {
    const { piece: p, grid: g, gameState: gs } = stateRef.current;
    if (!p || !gs.isPlaying || gs.isGameOver) return;

    let newShape = p.shape;
    if (rotate) {
      newShape = p.shape.map(pt => ({ x: -pt.y, y: pt.x }));
    }
    const nx = p.x + dx;
    const ny = p.y + dy;

    let collision = false;
    for (let pt of newShape) {
      const cx = nx + pt.x;
      const cy = ny + pt.y;
      if (cx < 0 || cx >= COLS || cy >= ROWS) { collision = true; break; }
      if (cy >= 0 && g[cy][cx] !== null) { collision = true; break; }
    }

    if (!collision) {
      setPiece({ ...p, x: nx, y: ny, shape: newShape });
      const { food: f } = stateRef.current;
      if (f) {
        for (let pt of newShape) {
          if (nx + pt.x === f.x && ny + pt.y === f.y) {
            setSnakeLength(s => s + 1);
            setGameState(s => ({ ...s, score: s.score + 500 * Math.floor(stateRef.current.combo) }));
            spawnFood(g);
            break;
          }
        }
      }
    } else if (dy > 0 && !rotate && dx === 0) {
      lockPiece(p, g);
    }
  }, [spawnFood]);

  const lockPiece = (p: Piece, g: Grid) => {
    const newGrid = g.map(row => [...row]);
    for (let pt of p.shape) {
      const cy = p.y + pt.y;
      const cx = p.x + pt.x;
      if (cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) {
        newGrid[cy][cx] = { colorIndex: p.colorIndex };
      }
    }
    
    let linesCleared = 0;
    const finalGrid = newGrid.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(null));
    }

    if (linesCleared > 0) {
      const { gameState: gs, combo: c } = stateRef.current;
      setGameState({
        ...gs,
        lines: gs.lines + linesCleared,
        score: gs.score + (linesCleared * 1000 * Math.floor(c)),
        level: Math.floor((gs.lines + linesCleared) / 10) + 1
      });
      setCombo(c + 0.5);
    } else {
      setCombo(1);
    }

    setGrid(finalGrid);
    const nextType = stateRef.current.nextPieceIndex;
    const nextP = { ...getRandomPiece(), colorIndex: nextType, shape: JSON.parse(JSON.stringify(SHAPES[nextType])) };
    setNextPiece(Math.floor(Math.random() * 7) + 1);

    for(let pt of nextP.shape) {
      const cy = nextP.y + pt.y;
      const cx = nextP.x + pt.x;
      if (cy >= 0 && finalGrid[cy][cx] !== null) {
        setGameState(s => ({ ...s, isGameOver: true, isPlaying: false }));
        return;
      }
    }

    setPiece(nextP);
  };

  const tick = useCallback(() => {
    movePiece(0, 1, false);
  }, [movePiece]);

  useEffect(() => {
    const { gameState: gs } = stateRef.current;
    if (!gs.isPlaying) return;
    const speed = Math.max(100, 800 - (gs.level * 50) - (stateRef.current.snakeLength * 5));
    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [tick, stateRef.current.gameState.isPlaying, stateRef.current.gameState.level, stateRef.current.snakeLength]);

  return { grid, piece, food, gameState, snakeLength, combo, nextPiece: nextPieceIndex, startGame, movePiece };
}
