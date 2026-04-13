import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import UserTradeRow from "../components/UserTradeRow";
import { FAKE_DATA } from "../data/placeholderData";

const Community = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Community Page
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Available Trades:
      </Typography>

      <Stack spacing={4} sx={{ mt: 4 }}>
        {FAKE_DATA.map((user) => (
          <UserTradeRow key={user.id} user={user} />
        ))}
      </Stack>
    </Container>
  );
};

export default Community;
