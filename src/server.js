import { config } from "dotenv-safe"; config();
import { dbConnection } from "./config/db.js";
import app from "./config/app.js";

(async () => {
  await dbConnection();

  app.listen(process.env.PORT, () => {
    console.log(`The server is running at port ${process.env.PORT}`);
  });
})();
