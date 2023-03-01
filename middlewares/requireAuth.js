import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
	const [type, token] = req.headers["Authorization"].split(" ");

    if(type !== "bearer") {
        next("unsupported authentication")
    } 

	try {
		const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
		req.user = payload;
	} catch (error) {
		next(error);
	}
	next();
};