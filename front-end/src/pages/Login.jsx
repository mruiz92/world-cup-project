import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate} from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 450,
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',

    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',

    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px'

    }),
}));

export default function Login() {
    const navigate = useNavigate();

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);

        const payload = {
            email: data.get('email'),
            password: data.get('password'),
        };

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.ok) {
                navigate("/dashboard");
            } else {
                alert(result.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Server error during login:", error);
        }
    };

    return (
        <Card variant="outlined">
            <Typography component="h1" variant="h4">
                Sign In
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        required
                        fullWidth
                        error={emailError}
                        helperText={emailErrorMessage}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        required
                        fullWidth
                        error={passwordError}
                        helperText={passwordErrorMessage}
                    />
                </FormControl>

                <Button type="submit" fullWidth variant="contained">
                    Sign In
                </Button>

                <Typography sx={{ textAlign: 'center' }}>
                    Need an account? <Link href="/register">Sign up</Link>
                </Typography>
            </Box>
        </Card>
    );
}