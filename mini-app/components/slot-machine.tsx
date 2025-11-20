"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newRow = Array.from({ length: 3 }, getRandomFruit);
        return [newRow, ...prev.slice(0, 2)];
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  const isWin = !spinning && (
    // Rows
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    // Columns
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2])
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div key={idx} className="flex justify-center items-center w-16 h-16 border rounded">
            <img src={`/${fruit.toLowerCase()}.png`} alt={fruit} width={64} height={64} />
          </div>
        ))}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {isWin && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">You won!</p>
          <Share text={`I just won a fruit combo! ${url}`} />
        </div>
      )}
    </div>
  );
}
