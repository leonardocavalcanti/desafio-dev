import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { CircularProgress, Icon, IconButton, InputAdornment, Snackbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { getCsrfToken } from 'next-auth/client';
import { signIn } from 'next-auth/client';
import { useEffect } from 'react';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),
  },
  form: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
}));

export default function Login() {
  const classes = useStyles();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState('');

  const [severity, setSeverity] = useState('error');

  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    getCsrfToken().then(res => {
      setCsrfToken(res);
    });
  }, []);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errors, setErros] = useState({
    email: false,
    password: false,
  });

  const handleChange = (event: any) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    setErros({ ...errors, [event.target.name]: !event.target.value || event.target.value.length === 0 });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitSignIn = async () => {
    if (!isValid()) {
      setMessage('You must fill the required fields');
      setSeverity('warning');
      setOpen(true);

      return;
    }

    setLoading(true);

    signIn('email-login', { email: user.email, password: user.password, redirect: false, csrfToken }).then(
      (res: any) => {
        console.log(res);

        if (!res.error) {
          router.replace('/');
        } else {
          setMessage(res.error);

          setOpen(true);
          setLoading(false);
        }
      },
    );
  };

  const isValid = () => {
    let hasErrors = false;

    const e = { ...errors };

    if (user.email.length === 0) {
      hasErrors = true;
      e.email = true;
    }

    if (user.password.length === 0) {
      hasErrors = true;
      e.password = true;
    }

    setErros(e);

    return !hasErrors;
  };

  return (
    <>
      <Snackbar open={open}>
        <Alert severity={severity as any}>{message}</Alert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <LockOutlinedIcon style={{ fontSize: 40, margin: 20 }} color="primary" />
          <form
            className={classes.form}
            noValidate
            onSubmit={e => {
              e.preventDefault();
              submitSignIn();
            }}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} hidden />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={errors.email}
                  value={user.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={errors.password}
                  value={user.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                startIcon={<Icon></Icon>}
                endIcon={<Icon>chevron_right</Icon>}
                className={classes.submit}
                disabled={loading}
              >
                SIGN IN
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            <Typography variant="body1" color="primary" style={{ textAlign: 'center' }}>
              or
            </Typography>
            <Link href="/auth/sign-up" passHref>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                size="large"
                color="primary"
                className={classes.submit}
              >
                CREATE NEW ACCOUNT
              </Button>
            </Link>
          </form>
        </div>
      </Container>
    </>
  );
}
