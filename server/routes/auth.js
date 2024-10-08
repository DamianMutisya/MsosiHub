const express = require('express');
const passport = require('passport');

const router = express.Router();

// Initiate Google authentication
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Handle the callback after Google has authenticated the user
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  });

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
