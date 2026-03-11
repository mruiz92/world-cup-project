import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
