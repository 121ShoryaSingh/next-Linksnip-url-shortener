import { MongoClient } from 'mongodb'

if(!process.env.MONGO_DB_URL) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URL');
}

const url = process.env.MONGO_DB_URL;
const options = {};

let client ;
let clientPromise: Promise<MongoClient>

if(process.env.NODE_ENV === 'development') {
    // In development mode, use a goblal variable so that
    // the value is preserved across module reloads caused by HMR(Hot Module Replacement)
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    };

    if(!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(url, options);
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(url , options);
    clientPromise = client.connect()
}

export default clientPromise;