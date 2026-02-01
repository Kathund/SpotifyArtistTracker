import ArtistMongo from './Artist/Artist.js';
import { connect } from 'mongoose';
import type Application from '../Application.js';

class MongoManger {
  readonly Application: Application;
  readonly artist: ArtistMongo;
  constructor(app: Application) {
    this.Application = app;
    this.artist = new ArtistMongo(this);
  }

  async connect() {
    await connect(process.env.MONGO_URL).then(() => console.other('Mongo Connected'));
  }
}

export default MongoManger;
