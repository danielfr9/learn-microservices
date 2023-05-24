import express from "express";
import errorHandler from "./middlewares/error-handler";
import authRouter from "./router/auth";
import { NotFoundError } from "./errors/not-found-error";
import "express-async-errors";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api/users", authRouter);

app.get("/api/users/currentuser", (req, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
