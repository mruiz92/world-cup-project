const UserTradeRow = ({ user }) => {
  return (
    <div>
      <h3>{user.username}</h3>
      
      <div>
        {user.tradableCards.map((card) => (
          <div key={card.id}>
            <img src={card.image} alt={card.playerName} />
            <p>{card.playerName}</p>
            <p>{card.nationality}</p>
            <p>{card.rarity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTradeRow;
