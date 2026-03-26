import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
  styled
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import StyleIcon from "@mui/icons-material/Style";
import InventoryIcon from "@mui/icons-material/Inventory";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  borderRadius: theme.shape.borderRadius, 
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: 'hsla(220, 30%, 5%, 0.15) 0px 10px 20px 0px',
  },
  
}));
export default function Home() {
  const navigate = useNavigate();

  const userId = 2;
  const [user, setUser] = React.useState(null);
  const [inventory, setInventory] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCards, setOpenCards] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/register");
      }
    };
    fetchUser();

  }, [userId, navigate]);

  React.useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:4000/api/inventory/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setInventory(data);

          if(data.length === 0 && user.currency === 0) {
            console.log("New user detected. Triggering starter pack");
            handleOpenCardPack(10, 0);
          }
        
        })
        .catch((err) => console.error("Error loading inventory:", err));
    }
  }, [user?.id, user?.currency]);

  const groupedInventory = inventory.reduce((groups, item) => {
    const nation = item.card?.nationality || "Unknown";
    if (!groups[nation]) {
      groups[nation] = [];
    }
    groups[nation].push(item);
    return groups;
  }, {});

  const nationalities = Object.keys(groupedInventory).sort();

  const handleOpenCardPack = async (packSize = 5, packCost = 0) => {
    // Check if user is loaded
    if (!user) return;

    try {
      const response = await fetch("http://localhost:4000/api/open-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          packSize: packSize,
          packCost: packCost,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set the new cards to modal
        setOpenCards(data.cards);
        // Open popup
        setIsModalOpen(true);
        // Re-fetch inventory to show the new cards
        const invRes = await fetch(
          `http://localhost:4000/api/inventory/${user.id}`,
        );
        const invData = await invRes.json();
        setInventory(invData);
      } else {
        // Handle errors
        alert(data.error || "Something went wrong opening the pack.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not connect to the server.");
    }
  };


  console.log(
    "My Card IDs:",
    inventory.map((item) => item.card.id),
  );

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default'}}>
      <Box sx={{ position: "relative", overflow: 'hidden' }}>
        {/*<Box
          component="img"
          sx={{
            height: "auto",
            width: "100%",
            objectFit: "cover",
            display: "block",
          }}
          alt="Game Banner"
          src="../src/assets/PocketPlayersBanner.png"
        />*/}
     <Box 
  sx={{ 
    display: 'flex',          // 1. Activate Flexbox (puts items in a row)
    flexDirection: 'row',     // 2. Ensure it's a row (default, but good to be explicit)
    alignItems: 'center',     // 3. Vertical Centering (up and down)
    justifyContent: 'center', // 4. Horizontal Centering (left and right)
    gap: 2,                   // 5. Automatic spacing between the 3 items
    width: '100%',            // 6. Make sure the box spans the full page width
    py: 4,                    // 7. Optional: Padding top/bottom for breathing room
  }}
>
        <Box
    component="img"
    sx={{ height: 60, width: 'auto' }}
    alt="Icon Left"
    src="../src/assets/SoccerBall.png" 
  />
        <Typography
          variant="h3"
          sx={{
fontWeight: "bold",
      color: "text.primary",
          }}
        >
          Pocket Players
        </Typography>
      
      <Box
    component="img"
    sx={{ height: 60, width: 'auto' }}
    alt="Icon Right"
    src="../src/assets/SoccerBall.png" 
  />
  </Box>
      <AppBar
       position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', flex: 1 }}>
          <Button
            sx={{ mr: 2 }}
            color="inherit"
            startIcon={<PeopleIcon />}
            onClick={() => navigate("/communitypage")}
          >
            Community
          </Button>
          <Button
            color="inherit"
            startIcon={<LibraryBooksIcon />}
            onClick={() => handleOpenCardPack(5, 0)}
          >
            Open Pack
          </Button>
          </Box>
<Typography
    variant="h6"
    component="div"
    sx={{
      fontWeight: 'bold',
      textAlign: 'center',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    }}
  >
    Total Funds: {user ? user.currency : 0}
  </Typography>
          
          <Box>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}
            >
              {user ? user.username : "Loading..."}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Profile Page</MenuItem>
              <MenuItem onClick={() => navigate("/register")}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {nationalities.map((nation) => (
          <Box key={nation} sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#1976d2",
                borderBottom: "2px solid #1976d2",
                pb: 1,
              }}
            >
              {nation}
            </Typography>
            <Grid container spacing={3}>
              {groupedInventory[nation].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <Card
                    sx={{
                      width: 200,
                      height: 325,
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        "https://img.freepik.com/premium-vector/editable-design-icon-football_362714-11701.jpg?semt=ais_rp_progressive&w=740&q=80"
                      }
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.card?.short_name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Rating: {item.card?.rating || "N/A"}
                      </Typography>
                      <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid #eee" }}>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          x{item.quantity}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Pack Opening Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 4,
            boxShadow: 24,
            maxWidth: "90vw",
            textAlign: "center",
            outline: "none",
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            {openCards.length > 5
              ? "Welcome Starter Pack!"
              : "New Pack Opened!"}
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {openCards.map((card, index) => (
              <Grid item key={index}>

                <Card sx={{ width: 180, height: 300 }}>
                    <Typography
                      variant="h7"
                      display="block"
                      color="primary"
                    >
                      {card.nationality}
                    </Typography>
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      "https://img.freepik.com/premium-vector/editable-design-icon-football_362714-11701.jpg?semt=ais_rp_progressive&w=740&q=80"
                    }
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold" }}
                      noWrap
                    >
                      {card.short_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating: {card.rating}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => setIsModalOpen(false)}
          >
            Add to Inventory
          </Button>
        </Box>
      </Modal>
    </Box>
    </Box>
  );
}
