import JWT from "jsonwebtoken";
import createErrors from "http-errors";
export const signedAccessToken = (user) => {
	return new Promise((resolve, reject) => {
		const payload = {
			_id: user._id,
			admin: true,
		};
		const secret = process.env.SECRET_ACCESS_TOKEN;
		const options = {
			expiresIn: "1d",
			audience: [user._id, user.admin],
		};
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});
};

export const verifyAccessToken = (req, res, next) => {
	try {
		if (!req.headers["authorization"])
			return next(createErrors.Unauthorized());

		const auth_token = req.headers["authorization"].split(" ")[1];
		JWT.verify(
			auth_token,
			process.env.SECRET_ACCESS_TOKEN,
			(error, payload) => {
				if (error) {
					const message =
						error.name === "JsonWebTokenError"
							? "UNAUTHORIZED"
							: error.message;
					next(createErrors.Unauthorized(message));
				}
				req.user = payload;
				next();
			}
		);
	} catch (error) {
		next(error);
	}
};
