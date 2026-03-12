import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
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
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={user.pfp}
          alt={user.username}
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6" fontWeight="bold">
          {user.username}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          pb: 2,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(127, 127, 127, 0.5)",
            borderRadius: "10px",
          },
        }}
      >
        {user.tradableCards.map((card) => (
          <Card key={card.id} sx={{ minWidth: 120, maxWidth: 120 }}>
            <CardMedia
              component="img"
              height="140"
              image={card.image}
              alt={card.playerName}
            />
            <Box sx={{ p: 1 }}>
              <Typography variant="caption" display="block" fontWeight="bold">
                {card.playerName}
              </Typography>
              <Typography variant="caption" display="block">
                {card.nationality}
              </Typography>
              <Typography variant="caption" display="block">
                {card.rarity}
              </Typography>
            </Box>
          </Card>
        ))}
      </Stack>
    </TradeRowCard>
  );
};

export default UserTradeRow;
