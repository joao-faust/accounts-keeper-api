import mongoose from "mongoose";

export async function dbConnection() {
  try {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`);
  }
  catch (error) {
    console.log("Database error:" + error);
  }
}

mongoose.connection.on("error", error => {
  console.log("Database error:" + error);
});
mongoose.connection.on("open", () => {
  console.log("Database connection successfully established.")
});
