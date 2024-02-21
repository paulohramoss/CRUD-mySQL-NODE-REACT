import React, { useEffect, useState } from "react";
import "./App.css";
import WinnerList from "./WinnerList";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const isBoardFull = board.every((square) => square !== null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winners, setWinners] = useState([]);
  const [players, setPlayers] = useState({ player1: "", player2: "" });
  const [visibleWinners, setVisibleWinners] = useState(5);
  const [allWinnersLoaded, setAllWinnersLoaded] = useState(false);

  const handlePlayerChange = (e, player) => {
    const name = e.target.value;
    if (player === 1) {
      setPlayer1(name);
    } else {
      setPlayer2(name);
    }
  };

  const handleStartGame = () => {
    setCurrentPlayer(player1 !== "" && player2 !== "" ? player1 : "Player 1");
    setPlayers({ player1: player1, player2: player2 });
  };

  const handleClick = (index) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[index]) return;
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (index) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Campeão: ${
        winner === players.player1 ? players.player2 : players.player1
      }`
    : `Próximo jogador: ${xIsNext ? players.player1 : players.player2}`;

  const saveWinner = async (winner) => {
    try {
      const response = await fetch("http://localhost:3001/saveWinner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winner }),
      });

      if (response.ok) {
        console.log("Vencedor salvo com sucesso!");
      } else {
        console.error("Erro ao salvar vencedor");
      }
    } catch (error) {
      console.error("Erro ao salvar vencedor:", error);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/winners?limit=${visibleWinners}`
      );
      if (response.ok) {
        const winnersData = await response.json();
        if (winnersData.length < visibleWinners) {
          setAllWinnersLoaded(true);
        }
        setWinners(winnersData);
      } else {
        console.error("Erro ao buscar vencedores");
      }
    } catch (error) {
      console.error("Erro ao buscar vencedores:", error);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [visibleWinners]);

  const handleLoadMoreWinners = () => {
    setVisibleWinners(visibleWinners + 5);
  };

  useEffect(() => {
    if (winner) {
      saveWinner(winner);
    }
  }, [winner]);

  useEffect(() => {
    fetchWinners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchWinners();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="game">
      <div className="players-container">
        {!(player1 && player2 && currentPlayer) ? (
          <div>
            <input
              type="text"
              placeholder="Player 1"
              value={player1}
              onChange={(e) => handlePlayerChange(e, 1)}
            />
            <input
              type="text"
              placeholder="Player 2"
              value={player2}
              onChange={(e) => handlePlayerChange(e, 2)}
            />
            <button onClick={handleStartGame}>Iniciar Jogo</button>
          </div>
        ) : (
          <div className="game-info">
            <h2>Jogador a Iniciar: {currentPlayer}</h2>
            <h3>
              {player1} vs {player2}
            </h3>
            <div className={"game-board"}>
              <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
              </div>
              <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
              </div>
              <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
              </div>
            </div>
            <div className={`game-info ${winner ? "winner-zoom" : ""}`}>
              <div>{status}</div>
              {(winner || isBoardFull) && (
                <button onClick={handleRestart}>Reiniciar Jogo</button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="winner-list-container">
        {winners.length > 0 && (
          <div className="winner-list">
            <h2>Histórico de Vencedores</h2>
            <WinnerList winners={winners} />
            {!allWinnersLoaded && (
              <button onClick={handleLoadMoreWinners}>Ver Mais</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const calculateWinner = (squares) => {
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
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
};