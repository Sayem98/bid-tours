import express, { NextFunction, Request, Response } from "express";
import proxy from "express-http-proxy";

const app = express();

app.use(express.json()); // For JSON data

app.use(
  "/auth",
  proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
      console.log(`/api/v1${req.url}`);
      return `/api/v1/auth${req.url}`;
    },
  })
);

app.use(
  "/users",
  proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
      console.log(`/api/v1/users${req.url}`);
      return `/api/v1/users${req.url}`;
    },
  })
);

app.use(
  "/tours",
  proxy("http://localhost:3002", {
    proxyReqPathResolver: (req) => {
      console.log(`/api/v1/tours${req.url}`);
      return `/api/v1/tours${req.url}`;
    },
  })
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(3000, () => {
  console.log("Gateway is running on port 3000");
});
