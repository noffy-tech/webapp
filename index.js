import "dotenv/config";
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import keys from "./config/keys.js";

const app = express();

// Validate Google OAuth credentials
if (!keys.googleClientID || !keys.googleClientSecret) {
  throw new Error(
    "Missing Google OAuth credentials. Check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
  );
}

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Google user profile
      return done(null, profile);
    },
  ),
);

// Initialize Passport
app.use(passport.initialize());

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Google OAuth application is running" });
});

// Start Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  (req, res) => {
    res.json({
      message: "Google authentication successful",
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        emails: req.user.emails,
        photos: req.user.photos,
      },
    });
  },
);

// Local development only; Vercel handles production requests
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
