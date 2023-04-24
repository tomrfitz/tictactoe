import { useEffect, useState } from "react";
import useFetchServerMove, { MessageResponse } from "./useFetchServerMove";

function Square({
  value,
  onSquareClick,
}: {
  value: number;
  onSquareClick: any;
}) {
  return (
    <button type="submit" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
  currentMove,
}: {
  xIsNext: boolean;
  squares: any[];
  onPlay: any;
  currentMove: number;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
      onPlay(nextSquares);
      return;
    } else {
      // nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner[0];
    for (let i = 0; i < winner[1].length; i++) {
      const winnerIndex: number = winner[1][i];
      document
        .getElementsByClassName("square")
        [winnerIndex].classList.add("winner");
    }
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    const prevWinners = document.getElementsByClassName("square");
    for (let i = 0; i < prevWinners.length; i++) {
      prevWinners[i].classList.remove("winner");
    }
  }

  const boardRows: number = 3;
  const boardColumns: number = 3;
  const rows: any[] = [];
  for (let i = 0; i < boardRows; i++) {
    const row: any[] = [];
    for (let j = 0; j < boardColumns; j++) {
      const squareIndex: number = i * boardColumns + j;
      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  useEffect(() => {
    if (!xIsNext) {
      onPlay(squares);
    }
  }, [currentMove, xIsNext, onPlay, squares]);

  return (
    <>
      <div className="status">{status}</div>
      <div className="currentMove">You are at move #{currentMove}</div>
      <div className="board">
        <div className="yCoords">
          <div className="yCoord">3</div>
          <div className="yCoord">2</div>
          <div className="yCoord">1</div>
        </div>
        <div className="rows">{rows}</div>
        <div className="coordLabel">Y/X</div>
        <div className="xCoords">
          <div className="xCoord">1</div>
          <div className="xCoord">2</div>
          <div className="xCoord">3</div>
        </div>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [listReverse, setListReverse] = useState(false);
  const [nums, setNums] = useState<number[]>([]);
  const {
    serverMove,
  }: // error,
  // loading,
  {
    serverMove: MessageResponse | null;
    // error: string | null;
    // loading: boolean;
  } = useFetchServerMove(nums);

  function handlePlay(nextSquares: any[]) {
    console.log("xIsNext", xIsNext);
    var indexes = [];

    if (xIsNext) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      console.log("currentMove X", currentMove);
      for (let i = 0; i < nextSquares.length; i++) {
        if (nextSquares[i] !== null) {
          indexes.push(i);
        }
      }
      setNums(indexes);
    }

    if (!xIsNext) {
      if (serverMove !== null) {
        let serverIdx = Number(serverMove.message);
        nextSquares[serverIdx] = "O";
      }
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      console.log("currentMove O", currentMove);
      for (let i = 0; i < nextSquares.length; i++) {
        if (nextSquares[i] !== null) {
          indexes.push(i);
        }
      }
      setNums(indexes);
    }
  }

  console.log(nums);
  console.log(serverMove);

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  var moves = history.map((_squares, move) => {
    let description: string;
    if (move > 0) {
      description = "Go to move #" + move;
      const prevSquares = history[move - 1];
      const nextSquares = history[move];
      const turnTaker = move % 2 === 0 ? "O" : "X";
      for (let i = 0; i < prevSquares.length; i++) {
        if (prevSquares[i] !== nextSquares[i]) {
          const coordinates: number[] = [(i % 3) + 1, 3 - Math.floor(i / 3)];
          description += ` (${turnTaker} at ${coordinates})`;
          break;
        }
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const reverseMoveList = () => {
    setListReverse(!listReverse);
  };

  const ReverseMoveListButton = () => {
    return <button onClick={reverseMoveList}>Reverse Move List</button>;
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <ReverseMoveListButton />
        <ul>{listReverse ? moves : moves.reverse()}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winningLine = [a, b, c];
      return [squares[a], winningLine];
    }
  }
  return null;
}
