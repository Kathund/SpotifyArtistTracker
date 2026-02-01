import RequestHandler from './Private/RequestHandler.js';
import Routes from './Routes/index.js';
import express from 'express';
import session from 'express-session';
import type Application from '../Application.js';

class SpotifyManager {
  readonly Application: Application;
  readonly requestHandler: RequestHandler;
  readonly expressServer: express.Application;
  readonly scopes: string[];
  readonly interval: NodeJS.Timeout;
  constructor(app: Application) {
    this.Application = app;
    this.requestHandler = new RequestHandler(this);
    this.expressServer = express();
    this.startWebServer();
    this.scopes = ['user-read-email', 'user-read-private'];
    this.interval = setInterval(async () => await this.refreshAuth(), 1000 * 3600);
    this.refreshAuth();
  }

  private async refreshAuth() {
    const authFile = Bun.file('auth.json');
    const exists = await authFile.exists();
    if (!exists) {
      return console.warn(
        `Missing Spotify Auth File. Please login to spotify via http://127.0.0.1:${process.env.PORT}/auth/login`
      );
    }
    const res = await fetch(`http://127.0.0.1:${process.env.PORT}/auth/refresh`);
    if (res.status !== 200) return console.warn('Token refresh failed.');
    console.other('Token refreshed successfully.');
  }

  private startWebServer() {
    this.expressServer.use(
      session({ secret: 'your-secret-key', resave: false, saveUninitialized: true, cookie: { secure: false } })
    );
    for (const RouteClass of Routes) {
      const route = new RouteClass(this);
      this.expressServer.get(route.path, route.handle.bind(route));
    }
    this.expressServer.listen(Number(process.env.PORT), () => {
      console.other(`Proxy server listening at http://127.0.0.1:${process.env.PORT}`);
    });
  }
}

export default SpotifyManager;
