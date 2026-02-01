import RemoveArtistsWithoutServersScript from './Scripts/RemoveArtistsWithoutServers.js';
import RemoveInvalidServersScript from './Scripts/RemoveInvalidServers.js';
import UpdateArtists from './Scripts/UpdateArtists.js';
import type Application from '../Application.js';

class ScriptManager {
  readonly Application: Application;
  readonly removeArtistsWithoutServers: RemoveArtistsWithoutServersScript;
  readonly removeInvalidServers: RemoveInvalidServersScript;
  readonly updateArtists: UpdateArtists;
  constructor(app: Application) {
    this.Application = app;
    this.removeArtistsWithoutServers = new RemoveArtistsWithoutServersScript(this);
    this.removeInvalidServers = new RemoveInvalidServersScript(this);
    this.updateArtists = new UpdateArtists(this);

    setInterval(async () => await this.updateArtists.execute(), 10 * 60 * 1000);
  }
}

export default ScriptManager;
