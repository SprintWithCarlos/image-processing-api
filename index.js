const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5001;
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const postRoute = require("./routes/posts");
//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use("/api/posts", postRoute);
// app.post("/upload", upload.single("file"), async (req, res, next) => {
//   //   console.log(req.file);
//   try {
//     const locations = req.file.transforms.map((item) => {
//       return { [item.id]: item.location };
//     });
//     return res.status(200).json({
//       message: "Files created Successfully",
//       locations,
//     });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API for the Image Uploader Dev Challenge",
  });
});
//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
//Start Server
app.listen(port, () => {
  console.log(`Backend server is running at ${port}`);
});
