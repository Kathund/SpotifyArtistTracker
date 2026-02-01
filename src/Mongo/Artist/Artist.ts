import BaseMongo from '../Private/BaseMogno.js';
import { type Artist, type ServerArtist, type Simple, artistSchema } from '../Private/Schemas.js';
import { model } from 'mongoose';
import type MongoManger from '../MongoManager.js';
import type { MongoReturnData } from '../../Types/Mongo.js';

class ArtistMongo extends BaseMongo<Artist> {
  readonly mongo: MongoManger;
  constructor(mongoo: MongoManger) {
    super();
    this.model = model('Artist', artistSchema);
    this.mongo = mongoo;
  }

  override async saveItem(data: Artist): Promise<MongoReturnData<Artist>> {
    const itemCheck = await this.getItem(data.id);
    if (itemCheck.success) return await this.updateItem(data);
    const savedItem = new this.model(data);
    await savedItem.save();
    return { success: true, info: 'Item Saved', data: savedItem };
  }

  override async updateItem(newData: Artist): Promise<MongoReturnData<Artist>> {
    const data = await this.model.findOneAndReplace({ id: newData.id }, newData);
    return { success: true, info: 'Item Updated', data };
  }

  async addServerToArtist(data: Simple, server: ServerArtist): Promise<MongoReturnData<Artist>> {
    const itemCheck = await this.getItem(data.id);
    if (!itemCheck.success || itemCheck.data === null) {
      return this.mongo.Application.scripts.updateArtists.updateArtist({ ...data, servers: [server], albums: [] });
    }
    const serverIndex = itemCheck.data.servers.findIndex((serverArtist) => serverArtist.id === server.id);
    if (serverIndex !== -1) itemCheck.data.servers.splice(serverIndex, 1);
    itemCheck.data.servers.push(server);
    return this.mongo.Application.scripts.updateArtists.updateArtist(itemCheck.data);
  }
}

export default ArtistMongo;
