import dotenv from "dotenv";
import mongoose from "mongoose";
import type { Mongoose } from "mongoose";
dotenv.config();
import { app } from "./app";

const local_db = process.env.DATABASE_LOCAL || "";
mongoose
  .connect(process.env.NODE_ENV === "development" ? local_db : local_db, {})
  .then((con: Mongoose) => {
    console.log("DB connection successful", con.connection.host);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
