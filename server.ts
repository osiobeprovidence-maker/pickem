import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pickem.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL, -- customer, business, runner, admin
    status TEXT DEFAULT 'approved', -- pending, approved
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- send_item, business_delivery, proxy, buy_deliver
    status TEXT DEFAULT 'requested', -- requested, assigned, picked_up, delivered, cancelled
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    item_description TEXT,
    contact_details TEXT,
    customer_id TEXT,
    business_id TEXT,
    runner_id TEXT,
    proxy_code TEXT,
    fee REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(business_id) REFERENCES users(id),
    FOREIGN KEY(runner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User routes
  app.post("/api/users", (req, res) => {
    const { id, name, email, role } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)");
      stmt.run(id, name, email, role);
      res.status(201).json({ id, name, email, role });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Delivery routes
  app.post("/api/deliveries", (req, res) => {
    const { id, type, pickup_location, drop_location, item_description, contact_details, customer_id, business_id, fee, proxy_code } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO deliveries (id, type, pickup_location, drop_location, item_description, contact_details, customer_id, business_id, fee, proxy_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, type, pickup_location, drop_location, item_description, contact_details, customer_id || null, business_id || null, fee, proxy_code || null);
      res.status(201).json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/deliveries", (req, res) => {
    const { role, userId } = req.query;
    let deliveries;
    if (role === 'runner') {
      deliveries = db.prepare("SELECT * FROM deliveries WHERE status = 'requested' OR runner_id = ?").all(userId);
    } else if (role === 'business') {
      deliveries = db.prepare("SELECT * FROM deliveries WHERE business_id = ?").all(userId);
    } else if (role === 'customer') {
      deliveries = db.prepare("SELECT * FROM deliveries WHERE customer_id = ?").all(userId);
    } else {
      deliveries = db.prepare("SELECT * FROM deliveries").all();
    }
    res.json(deliveries);
  });

  app.patch("/api/deliveries/:id", (req, res) => {
    const { status, runner_id } = req.body;
    try {
      if (runner_id && status === 'assigned') {
        const stmt = db.prepare("UPDATE deliveries SET status = ?, runner_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'requested'");
        const result = stmt.run(status, runner_id, req.params.id);
        if (result.changes === 0) throw new Error("Delivery already assigned or not found");
      } else {
        const stmt = db.prepare("UPDATE deliveries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        stmt.run(status, req.params.id);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
