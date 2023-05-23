import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
