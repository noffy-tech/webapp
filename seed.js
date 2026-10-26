import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

// Keep this block for local development, but Vercel will ignore it in production
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Crucial step for Vercel deployment: Export the app instance
export default app;
