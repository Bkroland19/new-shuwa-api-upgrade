import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log("Connected to DB !!");
    await mongoose.connection.on("connection", () => {
      console.log("Mongoose connection to db is very successfully");
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default InitiateMongoServer;
