// import express from "express";
// const router = express.Router();
// import {
//   createLadies,
//   deleteLadies,
//   getLadies,
//   updateLadies,
// } from "../controllers/ladiesController.js";
// import { verifyAccessToken } from "../helpers/jsonwebtoken.js";

// router.post("", getLadies);
// router.post("", verifyAccessToken, createLadies);
// router.post("/:id", verifyAccessToken, updateLadies);
// router.post("/:id", verifyAccessToken, deleteLadies);

// export default router;

import express from "express";
const router = express.Router();
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { User } from "../models/userModel.js";
import { verifyAccessToken } from "../helpers/jsonwebtoken.js";

cloudinary.config({
	cloud_name: "itgenius",
	api_key: "299184699938272",
	api_secret: "Yap8Xf03EOi_p23q6SEYrsgi1jc",
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary.v2,
	params: {
		folder: "shuwa",
		format: async (req, file) => "png",
		public_id: (req, file) => `${Date.now()}_${file.originalname}`,
	},
});

const upload = multer({ storage: storage });

router.post(
	"/upload/:id",
	verifyAccessToken,
	upload.single("image"),
	async (req, res) => {
		try {
			const uploader = await User.findById(req.user._id);

			if (!uploader.isAdmin) {
				return res.status(401).json({ error: "FORBIDDEN" });
			}
			const user = await User.findById(req.params.id);

			user.images = [...user.images, req.file.path];

			await user.save();

			res.json({ success: true, images: user.images });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Server Error" });
		}
	}
);

router.post("/create-user", verifyAccessToken, async (req, res) => {
	try {
		const uploader = await User.findById(req.user._id);

		const { username, email, mobile, location , age , color , status} = req.body;

		if (!uploader.isAdmin) {
			return res.status(403).json({ error: "FORBIDDEN" });
		}

		const user = await User.create({
			username,
			email,
			mobile,
			age,
			location,
			status,
			color
		});

		await user.save();

		res.json({ success: true, user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server Error when creating user" });
	}
});



router.get("/created-user", verifyAccessToken, async (req, res) => {
	try {
		const uploader = await User.findById(req.user._id);

		if (!uploader.isAdmin) {
			return res.status(403).json({ error: "FORBIDDEN" });
		}

		const users = await User.find();

		res.json({ success: true, users });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server Error" });
	}
});


router.patch("/patch/:id", verifyAccessToken, async (req, res) => {
	try {
	  const uploader = await User.findById(req.user._id);
	  const userToUpdate = await User.findById(req.params.id);
  
	  if (!uploader.isAdmin && uploader.id !== userToUpdate.id) {
		return res.status(401).json({ error: "FORBIDDEN" });
	  }
  
	  const { username, email, mobile, location, age, color, status } = req.body;
  
	  userToUpdate.username = username || userToUpdate.username;
	  userToUpdate.email = email || userToUpdate.email;
	  userToUpdate.mobile = mobile || userToUpdate.mobile;
	  userToUpdate.location = location || userToUpdate.location;
	  userToUpdate.age = age || userToUpdate.age;
	  userToUpdate.color = color || userToUpdate.color;
	  userToUpdate.status = status || userToUpdate.status;
  
	  await userToUpdate.save();
  
	  res.json({ success: true, user: userToUpdate });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "Server Error when updating user" });
	}
  });
  

export default router;
