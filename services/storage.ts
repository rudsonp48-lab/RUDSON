
import { AppData, ChurchEvent, Sermon, ChurchConfig, GalleryImage, Cell } from '../types';

const STORAGE_KEY = 'igreja_digital_data';

const DEFAULT_DATA: AppData = {
  config: {
    name: "Frutos do Espírito",
    pixKey: "financeiro@frutosdoespirito.org",
    liveUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
    liveTitle: "Culto de Celebração e Adoração",
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

export const loadAppData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Deep merge with defaults to ensure missing arrays are populated
      return {
        ...DEFAULT_DATA,
        ...parsed,
        config: { ...DEFAULT_DATA.config, ...(parsed.config || {}) },
        events: parsed.events || DEFAULT_DATA.events,
        sermons: parsed.sermons || DEFAULT_DATA.sermons,
        gallery: parsed.gallery || DEFAULT_DATA.gallery,
        cells: parsed.cells || DEFAULT_DATA.cells
      };
    } catch (e) {
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
