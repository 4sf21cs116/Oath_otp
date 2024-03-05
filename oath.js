const express = require('express');
const session = require('express-session');
const passport = require('passport');
const uuid = require('uuid').v4;


const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = 3000;

 const GOOGLE_CLIENT_ID = '978210302943-i5gl9isg6e6ctrsievlq1qr0mvcb7gfg.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_CALLBACK_URL = 'http://localhost:3000/auth/google/callback';


const sessionSecret = uuid();
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {

    res.redirect('/profile');
  }
);


app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/login');
  }
});


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.get('/login', (req, res) => {
  res.send('Please log in with Google: <a href="/auth/google">Login with Google</a>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
