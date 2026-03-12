import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const TradeRowCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 450,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const UserTradeRow = ({ user }) => {
  return (
    <TradeRowCard variant="outlined">
      <img src={user.pfp} />
      <Typography variant="h3">{user.username}</Typography>

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
    </TradeRowCard>
  );
};

export default UserTradeRow;
