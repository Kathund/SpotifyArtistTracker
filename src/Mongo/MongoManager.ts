import { connect } from 'mongoose';

class MongoManger {
  async connect() {
    await connect(process.env.MONGO_URL).then(() => console.other('Mongo Connected'));
  }
}

export default MongoManger;
