const WinnerList = ({ winners }) => {
    return (
      <div className="winner-list">
        <ul>
          {winners.map((winnerData, index) => (
            <li key={index}>{winnerData.winner}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default WinnerList;
  