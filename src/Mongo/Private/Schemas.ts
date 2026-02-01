import { type InferSchemaType, Schema } from 'mongoose';

export const simpleSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true }
});
export type Simple = InferSchemaType<typeof simpleSchema>;

export const artistServerSchema = new Schema({
  id: { type: String, required: true },
  channel: { type: String, required: true }
});
export type ServerArtist = InferSchemaType<typeof artistServerSchema>;

export const artistAlbumTrackSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  explicit: { type: Boolean, required: true },
  artists: { type: [simpleSchema], required: true },
  number: { type: Number, required: true }
});
export interface ArtistAlbumTrack extends Simple {
  explicit: boolean;
  artists: Simple[];
  number: number;
}

export const artistAlbumSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  artists: { type: [simpleSchema], required: true },
  tracks: { type: [artistAlbumTrackSchema], required: true },
  type: { type: String, enum: ['album', 'single', 'compilation'], required: true }
});
export interface ArtistAlbum extends Simple {
  artists: Simple[];
  tracks: ArtistAlbumTrack[];
  type: string;
}

export const artistSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  servers: { type: [artistServerSchema], required: true },
  albums: { type: [artistAlbumSchema], required: true }
});
export interface Artist extends Simple {
  servers: ServerArtist[];
  albums: ArtistAlbum[];
}
