const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const log4js = require("log4js");
const logger = log4js.getLogger();

export class MongoStorage {
  private mongodbClient;
  private mongodbDb;
  private dbName: string;
  private url: string;
  constructor(mongoDbUrl: string) {
    this.url = mongoDbUrl;
    this.dbName = mongoDbUrl.split(`/`)[-1];
  }

  public async init() {
    const MongoClient = require("mongodb").MongoClient;
    // Use connect method to connect to the server
    this.mongodbClient = await MongoClient.connect(this.url);
    this.mongodbDb = this.mongodbClient.db(this.dbName);
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
