import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Icon, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

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
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    marginTop: theme.spacing(2),
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

export default function SignUp() {
  const classes = useStyles();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState('');

  const [severity, setSeverity] = useState('error');

  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [errors, setErros] = useState({
    email: false,
    name: false,
    password: false,
  });

  const handleChange = (event: any) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    setErros({ ...errors, [event.target.name]: !event.target.value || event.target.value.length === 0 });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const addUser = () => {
    if (!isValid()) {
      setMessage('You must fill the required fields');
      setSeverity('warning');
      setOpen(true);

      return;
    }

    setLoading(true);

    fetch('/api/auth/signup', {
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(async resp => {
        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.message);
        }
      })
      .then(() => router.push('/'))
      .catch(err => {
        setLoading(false);

        setMessage(err.message);
        setSeverity('error');
        setOpen(true);
      });
  };

  const isValid = () => {
    let hasErrors = false;

    const e = { ...errors };

    if (user.email.length === 0) {
      hasErrors = true;
      e.email = true;
    }

    if (user.name.length === 0) {
      hasErrors = true;
      e.name = true;
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
          <Typography component="h1" variant="h5">
            Create Your Account
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={e => {
              e.preventDefault();
              addUser();
            }}
          >
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
                  name="name"
                  required
                  fullWidth
                  id="name"
                  error={errors.name}
                  value={user.name}
                  label="Name"
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
                      <InputAdornment position="end" variant="filled">
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
                CREATE ACCOUNT
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}
