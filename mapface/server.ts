import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // WebSocket connection handling
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    
    // Simulate live data updates
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "WEATHER_UPDATE",
          data: {
            temp: 24 + Math.random() * 5,
            humidity: 60 + Math.random() * 10,
            timestamp: new Date().toISOString()
          }
        }));
      }
    }, 10000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock ML Inference Endpoint
  app.post("/api/scores/recompute", (req, res) => {
    const { bounds, objective, year } = req.body;
    // In a real app, this would call the FastAPI ML service
    // For now, we return a success message and clients will regenerate grid locally or via WS
    res.json({ message: "Recomputation triggered", objective, year });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`IRA Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
