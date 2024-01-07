const express = require("express");
const PORT = process.env.PORT || 3000;
const server = require("./server");
const app = express();

const startServer = async () => {
  await server(app);

  app
    .listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}....`);
    })
    .on("error", (err) => {
      console.log("Server error: " + err);
      process.exit(1);
    });
};

startServer();
