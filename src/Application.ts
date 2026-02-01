import CacheHandler from './Private/CacheHandler.js';
import DiscordManager from './Discord/DiscordManager.js';
import RequestHandler from './Private/RequestHandler.js';
import SpotifyManager from './Spotify/SpotifyManager.js';

class Application {
  readonly cacheHandler: CacheHandler;
  readonly discord: DiscordManager;
  readonly requestHandler: RequestHandler;
  readonly spotify: SpotifyManager;
  constructor() {
    this.cacheHandler = new CacheHandler();
    this.discord = new DiscordManager(this);
    this.requestHandler = new RequestHandler(this);
    this.spotify = new SpotifyManager(this);
  }

  async connect(): Promise<void> {
    await this.discord.connect();
  }
}

export default Application;
