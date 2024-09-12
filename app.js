import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { user } from "./models/user.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { name, email, image } = req.body;
  let createdUser = await user.create({
    name,
    email,
    image,
  });
  console.log("created user", createdUser);
  res.redirect("/read"); //go to "/read" route
});

app.get("/read", async (req, res) => {
  let allUsers = await user.find();
  res.render("read", { allUsers });
});

app.get("/edit/:userId", async (req, res) => {
  let edituser = await user.findOne({ _id: req.params.userId });
  res.render("edit", { edituser });
});

app.post("/update/:userId", async (req, res) => {
  let { name, image, email } = req.body;
  //////////////////////////////////////////////////////////////////////////////////////to get updated user
  let updateduser = await user.findOneAndUpdate(
    { _id: req.params.userId },
    { image, name, email },
    { new: true }
  );
  res.redirect("/read");
});
//You hyperlink should be calling the router mapping endpoint alone :href="/delete/<%= user._id%>"
//href or Links always perform GETs, forms can use GETs or POSTs.
app.get("/delete/:id", async (req, res) => {
  await user.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running at ${process.env.PORT || 3000}`);
});
