import './Board.css'; 

function Square({ value, onClick }) {
  const className = `square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`;

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
    const renderSquare = (i) => {
      return <Square value={squares[i]} onClick={() => onClick(i)} />;
    };
  

  return (
    <div>
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
  );
}

export default Board;
