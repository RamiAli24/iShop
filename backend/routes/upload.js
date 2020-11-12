import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();
import auth from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", auth, upload.single("image"), (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  res.send(`/${req.file.path}`);
});

export default router;
