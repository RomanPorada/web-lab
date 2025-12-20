const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const atomsRouter = require("./routes/atoms");
const moleculesRouter = require("./routes/molecules");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/atoms", atomsRouter);
app.use("/molecules", moleculesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
