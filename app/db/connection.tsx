import { MongoClient } from 'mongodb';

// Replace with your MongoDB instance URL
const url = `${process.env.MONGODB_URI}`;
const dbName = 'tekChat-App'; // Replace with your database name

let client: any;
const options = {
  connectTimeoutMS: 60000,
  maxPoolSize: 150
}

async function connect() {
  let retries = 0;
  const maxRetries = 5;
  while (retries < maxRetries) {
    try {
      client = await MongoClient.connect(url, options);
      client.on('TopologyChange', (err: any, topology: any) => {
        if (err) {
          console.error('Connection lost:', err);
        } else {
          console.log('Reconnected:', topology);
        }
      });

      return client.db(dbName);
    } catch (e) {
      console.log(`Retry ${retries + 1} of ${maxRetries}:`, e);
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
      retries++;
    }
  }
  throw new Error(`Failed to connect after ${maxRetries} retries`);
}
async function disconnect() {
  if (client)
    await client.close();
}
export { connect, disconnect };