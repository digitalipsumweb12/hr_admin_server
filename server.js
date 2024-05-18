import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/db.js";
dotenv.config();
// import
import auth from "./routes/authRoute.js";
// express
const app = express();
// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    parameterLimit: 100000,
    limit: "50mb",
  })
);
app.use(morgan());
app.disable("etag");
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/auth", auth);
app.get("/", (req, res) => {
  res.send("Server started!");
});

// db connection
db.connect((err)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log("Database Connected")
    }
})


// Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});