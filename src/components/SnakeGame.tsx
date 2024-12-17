
import React, { useState, useEffect} from "react";
import "./SnakeGame.css";
import { start } from "repl";




const generateRandomFood = () => {
    const maxCols = 20;
    const maxRows = 20;

    const x = Math.floor(Math.random() * maxCols);
    const y = Math.floor(Math.random() * maxRows);

    return { x, y };
};
const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10}]);
    const [food, setFood] = useState(generateRandomFood());
    const [direction, setDirection] = useState("RIGHT");
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [speed, setSpeed] = useState(200);
    const [highScore, setHighScore] = useState(
        Number(localStorage.getItem("highScore")) || 0
    );
    const [hasGameStarted, setHasGameStarted] = useState(false);

    const gridSize = 20;
    
  
    useEffect(() => {
        const startGame = () => {
            if(!hasGameStarted) {
                setHasGameStarted(true);
            }
        };
        window.addEventListener("keydown", startGame);
        return () => window.removeEventListener("keydown", startGame);
    }, [hasGameStarted]);


    useEffect(() => {
        if(!hasGameStarted || isGameOver) return;

        const moveSnake = () => {
            setSnake((prev) => {
                if(!prev || prev.length === 0) return [{ x: 10, y: 10}];

                const newSnake = [...prev];
                const head = {...newSnake[0] };

                if(direction === "UP") head.y -= 1;
                if(direction === "DOWN") head.y += 1;
                if(direction === "LEFT") head.x -= 1;
                if(direction === "RIGHT") head.x += 1;

                if (
                    head.x < 0 || head.x >= gridSize ||
                    head.y < 0 || head.y >= gridSize ||
                    newSnake.some((part) => part.x === head.x && part.y === head.y)
                ) {
                    setIsGameOver(true);
                    alert("Game over! Du krockade");
                    return prev;
                }

                newSnake.unshift(head);
                newSnake.pop();

                if ( head.x === food.x && head.y === food.y) {
                    setScore((prev) =>  prev + 10);
                    setFood(generateRandomFood());
                    newSnake.push({...newSnake[newSnake.length - 1] });
                }

                return newSnake;
            });

        };

        const interval = setInterval(moveSnake, speed);
        return () => clearInterval(interval);
    }, [direction, food, speed, hasGameStarted, isGameOver]);

    if(score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score.toString());
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
            if(e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
            if(e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
            if(e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");

        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    
    useEffect(() => {
        if(score >= 30 && score < 50) setSpeed(150);
        if(score >= 90 && score < 100) setSpeed(100);
        if(score >= 200) setSpeed(50);
    }, [score]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 5, y: 5});
        setScore(0);
        setDirection("RIGHT");
        setIsGameOver(false);
    };


    return (
        <div className="game-container">
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-4">Snake Game</h1>
        <p className="text-center text-lg text-gray-600 mb-2">Score: {score}</p> 
        <p className="text-center text-lg text-gray-600 mb-2">High Score: {highScore}</p>
        <button onClick={resetGame} className="reset-button">
          Starta om spelet
        </button>
        {!hasGameStarted && (
            <div className="overlay">
            <h2>Tryck på en tangent för att starta spelet!</h2>
            </div>
        )}
        <div className="grid">
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const isSnake = snake.some((part) => part.x === col && part.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
                />
              );
            })
          )}
        </div>
      </div>
    );
};

export default SnakeGame;