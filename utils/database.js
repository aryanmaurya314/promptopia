import mongoose from 'mongoose';

let isConnected = false;

const connectedToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('Already connected to database');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'share_prompt',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Connected to database.');
  } catch (error) {
    console.log(error);
  }
};

export default connectedToDB;
