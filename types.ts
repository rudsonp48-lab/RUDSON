
import React from 'react';

export enum AppView {
  HOME = 'home',
  EVENTS = 'events',
  BIBLE = 'bible',
  SERMONS = 'sermons',
  MORE = 'more',
  PRAYER = 'prayer',
  TITHING = 'tithing',
  CELLS = 'cells',
  LIVE = 'live',
  ADMIN = 'admin',
  LOGIN = 'login',
  GALLERY = 'gallery'
}

export interface ChurchConfig {
  name: string;
  pixKey: string;
  liveUrl: string;
  liveTitle: string;
  address: string;
  mapsUrl: string;
  spotifyUrl: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'AT' | 'NT';
}

export interface Verse {
  num: number;
  text: string;
}

export interface BiblePassage {
  reference: string;
  verses: Verse[];
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  thumbnail: string;
  duration: string;
  videoUrl: string; // Novo campo para o link do vídeo
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface Cell {
  id: string;
  name: string;
  host: string;
  day: string;
  time: string;
  location: string;
  members: number;
}

export interface AppData {
  config: ChurchConfig;
  events: ChurchEvent[];
  sermons: Sermon[];
  gallery: GalleryImage[];
  cells: Cell[];
}
