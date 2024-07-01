import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";
/**
 * @type {import("mongodb").Db}
 */
let db;

const dbConnect = async () => {
  if (db) return db;
  console.log(db)
  try {
    const uri = process.env.MONGO_URI;
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@next-hero.ktnme97.mongodb.net/?retryWrites=true&w=majority`;
    // const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-hzckllx-shard-00-00.wvig2d6.mongodb.net:27017,ac-hzckllx-shard-00-01.wvig2d6.mongodb.net:27017,ac-hzckllx-shard-00-02.wvig2d6.mongodb.net:27017/?ssl=true&replicaSet=atlas-sxh7jl-shard-0&authSource=admin&retryWrites=true&w=majority`;
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvig2d6.mongodb.net/?retryWrites=true&w=majority`;
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p1xbszw.mongodb.net/?ssl=true&retryWrites=true&w=majority`
  
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
// this is changed
    db = client.db(`ruqyahbd-forum`);

    await client.db("admin").command({ ping: 1 });
    return db;
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConnect;
