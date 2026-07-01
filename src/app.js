import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// function capitalizeFirstLetter(str) {
//   if (!str) return ""; // handle empty string
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import ledgerGroupRoutes from "./routes/ledgerGroupRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";

app.use("/smartledger/user", userRoutes);
app.use("/smartledger/company", companyRoutes);
app.use("/smartledger/ledger-group", ledgerGroupRoutes);
app.use("/smartledger/ledger", ledgerRoutes);

export default app;
