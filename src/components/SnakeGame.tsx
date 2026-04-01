import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastMoveDirectionRef = useRef(INITIAL_DIRECTION);
  const directionRef = useRef(INITIAL_DIRECTION);
  const foodRef = useRef(food);

  // Keep directionRef in sync with direction state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Keep foodRef in sync with food state
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    if (currentSnake.length >= GRID_SIZE * GRID_SIZE) {
      return { x: -1, y: -1 }; // No more space for food
    }
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastMoveDirectionRef.current = INITIAL_DIRECTION;
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastMoveDirectionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastMoveDirectionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastMoveDirectionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastMoveDirectionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Update last move direction
        lastMoveDirectionRef.current = directionRef.current;

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-[#0ff] shadow-[8px_8px_0px_#f0f] w-full max-w-lg">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-[#f0f] pb-2">
        <div className="text-[#0ff] text-2xl font-bold tracking-widest">
          DATA_YIELD: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-[#f0f] text-xl tracking-widest flex items-center bg-black px-2 border border-[#f0f]">
          {isPaused ? 'EXEC_MODE: HALTED' : 'EXEC_MODE: ACTIVE'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#0ff]"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Food */}
        <div
          className="absolute bg-[#f0f] animate-pulse"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${
                isHead 
                  ? 'bg-[#fff] border-2 border-[#f0f] z-10' 
                  : 'bg-[#0ff] border border-black'
              }`}
              style={{
                width: '20px',
                height: '20px',
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
              }}
            />
          );
        })}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 glitch-text" data-text="CRITICAL_FAILURE">
            <h2 className="text-[#f0f] text-4xl font-black mb-2 tracking-widest bg-black px-4 border-y-4 border-[#0ff]">CRITICAL_FAILURE</h2>
            <p className="text-[#0ff] text-2xl mb-6 bg-black px-2">FINAL_YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-[#f0f] text-black text-2xl font-bold border-4 border-[#0ff] hover:bg-[#0ff] hover:text-black hover:border-[#f0f] transition-none"
            >
              INITIATE_REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#0ff] text-lg text-center border border-[#0ff] p-2 bg-black shadow-[4px_4px_0px_#f0f]">
        INPUT_VECTOR: [W,A,S,D] OR [ARROWS]<br/>
        INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
