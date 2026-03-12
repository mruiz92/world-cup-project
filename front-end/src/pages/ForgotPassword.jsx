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

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    //    const [passwordError, setPasswordError] = React.useState(false);
    //    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    const validateInputs = () => {
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        /* const password = document.getElementById('password'); */

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
        if (!username.value || !/\S+@\S+\.\S+/.test(username.value)) {
            setNameError(true);
            setNameErrorMessage('Please enter a valid username.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        {/*
        if (!password.value) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        */}

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);

        const payload = {
            username: data.get('username'),
            email: data.get('email')
            /* password: data.get('password') */
        };

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.ok) {
                navigate("/email_verify");
            } else {
                alert(result.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Server error during login:", error);
        }
    };

    return (
        <Card variant="outlined">

            <Typography
                component="h1"
                variant="h4"
                sx={{fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
            >
                Forgot Password?
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{display: 'flex', flexDirection: 'column', gap: 2}}
            >
                Enter either your email or username
                to reset your password:
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        required
                        fullWidth
                        placeholder="your@email.com"
                        autoComplete="email"
                        error={emailError}
                        helperText={emailErrorMessage}
                    />
                </FormControl>

                <Divider>
                    <Typography sx={{color: 'text.secondary'}}>or</Typography>
                </Divider>

                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <TextField
                        id="username"
                        name="username"
                        required
                        fullWidth
                        placeholder="PocketPlayer"
                        autoComplete="username"
                        error={nameError}
                        helperText={nameErrorMessage}
                    />
                </FormControl>

                {/*  Password field shouldn't be applicable here since the user "forgot" their password.
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        required
                        fullWidth
                        placeholder="••••••"
                        autoComplete="new-password"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                    />
                </FormControl>
                */}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Submit
                </Button>
                <Divider />
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Typography sx={{textAlign: 'center'}}>
                        Are you sure you're registered?{' '}
                        <Link href="/register" variant="body2">
                            Click here to sign up!
                        </Link>
                    </Typography>
                </Box>
            </Box>

            {/*
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography sx={{textAlign: 'center'}}>
                    Not registered?{' '}
                    <Link href="/register" variant="body2">
                        Click here to sign up!
                    </Link>
                </Typography>
            </Box>
            */}

        </Card>
    );
}