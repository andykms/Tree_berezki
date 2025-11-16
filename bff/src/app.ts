import express from "express";
import cors from "cors";
import { PORT, ORIGIN_PATH } from "./config";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    origin: ORIGIN_PATH,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(errorHandler);


app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
