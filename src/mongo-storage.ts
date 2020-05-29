const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const log4js = require("log4js");
const logger = log4js.getLogger();

export class MongoStorage {
  private mongodbClient;
  private mongodbDb;

  public async init() {
    const MongoClient = require("mongodb").MongoClient;
    const dbName = process.env.MONGODB_URI.split(`/`)[-1];
    // Use connect method to connect to the server
    this.mongodbClient = await MongoClient.connect(process.env.MONGODB_URI);
    this.mongodbDb = this.mongodbClient.db(dbName);
  }

  public async close() {
    await this.mongodbClient.close();
  }

  /**
   *
   * @param collectionName
   * @param obj
   * @param numOfMonth
   *
   * @returns Promise of txId
   */
  public async save(collectionName, obj) {
    let collection = this.mongodbDb.collection(collectionName);
    await collection.insertOne(obj);
  }
}
