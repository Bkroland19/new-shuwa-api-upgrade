import { User } from "../models/userModel.js";
import createErrors from "http-errors";
import { userLogin, userRegister } from "../helpers/joiValidation.js";
import { signedAccessToken } from "../helpers/jsonwebtoken.js";

export const register = async (req, res, next) => {
	try {
		const validUser = await userRegister.validateAsync(req.body);
		const email = validUser.email;
		const username = validUser.username;
		const mobile = validUser.mobile;
		const oldUser = await User.findOne({
			$or: [{ email }, { username }, { mobile }],
		});
		if (oldUser)
			throw createErrors.Conflict(
				`${
					oldUser.email | oldUser.mobile | oldUser.username
				} already exists`
			);
		const newUser = await User.create(validUser);
		const accessToken = await signedAccessToken(newUser);
		await newUser.save((error) => {
			if (error) res.status(500).send(error.message);
			res.send({
				accessToken,
				message:
					"User was registered successfully!, please check your email",
				username: newUser.username,
			});
		});
		// res.send(newUser);
	} catch (error) {
		if (error.isJoi == true) error.status = 422;
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const validUser = await userLogin.validateAsync(req.body);
		const email = validUser.email;
		const username = validUser.username;
		const mobile = validUser.mobile;
		const user = await User.findOne({
			$or: [{ email }, { username }, { mobile }],
		});
		if (!user) throw createErrors.NotFound("User is not registered");
		const matchedPassword = await user.comparedPassword(validUser.password);
		console.log(matchedPassword);
		if (!matchedPassword)
			throw createErrors.Unauthorized("Incorrect credentials");
		if (user && matchedPassword) {
			const accessToken = await signedAccessToken(user._id);
			res.send({ accessToken, username: user.username, _id: user._id });
		}
	} catch (error) {
		if (error.isJoi === true) error.status = 422;
		next(error);
	}
};

export const me = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.json(user);
	} catch (e) {
		res.send({ message: "User does not exist" });
	}
};
