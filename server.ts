
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import { createServer as createViteServer } from "vite"; // Removed for Vercel compatibility

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "database.json");

const DEFAULT_DATA = {
  config: {
    name: "Frutos do Espírito",
    pixKey: "financeiro@frutosdoespirito.org",
    liveUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
    liveTitle: "Culto de Celebração e Adoração",
    youtubeLiveId: "",
    address: "Rua das Oliveiras, 123 - Centro",
    mapsUrl: "https://maps.google.com",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8977F2mXl9z"
  },
  events: [
    {
      id: '1',
      title: 'Workshop de Louvor',
      date: '10 Dezembro, 2024',
      time: '09:00 - 17:00',
      location: 'Auditório Principal',
      image: 'https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=800',
      price: 'Grátis'
    }
  ],
  sermons: [
    { 
      id: '1', 
      title: 'Como Vencer o Medo', 
      speaker: 'Pr. Márcio Silva', 
      date: 'Há 2 dias', 
      duration: '45:20', 
      thumbnail: 'https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=400',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
    }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800', title: 'Culto de Domingo', category: 'Cultos' }
  ],
  cells: [
    { id: '1', name: 'Célula Boas Novas', host: 'João & Maria', day: 'Quarta-feira', time: '20:00', location: 'Bairro Centro', members: 12 },
    { id: '2', name: 'Célula Koinonia', host: 'Carlos Rocha', day: 'Terça-feira', time: '19:30', location: 'Bairro Jardim', members: 8 }
  ]
};

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get("/api/data", (req, res) => {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read database" });
    }
  });

  app.post("/api/data", (req, res) => {
    try {
      const newData = req.body;
      fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save to database" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production (Vercel/Production)
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        if (req.path.startsWith('/api')) return;
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  // Export for Vercel
  if (process.env.VERCEL) {
    return app;
  } else {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

const appPromise = startServer();
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
