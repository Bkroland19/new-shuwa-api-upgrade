import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			lowercase: true,
		},
		mobile: {
			type: Number,
			unique: true,
			required: true,
		},
		password: { type: String },
		isAdmin: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
		},
		age: {
			type: Number,
			default: 21,
		},
		location: {
			type: String,
		},
		color: {
			type: String,
			enum: ["Brown", "Chocolate", "DarkSkin", "Dark"],
			default: "Dark",
		},
		price: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ["Available", "Unavailable"],
			default: "Unavailable",
		},
		images: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	try {
		var user = this;
		const SALT_WORK_FACTOR = 10;
		if (!user.isModified("password")) return next();

		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparedPassword = function (candidatePassword) {
	try {
		return bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		if (error) return error;
	}
};

export const User = mongoose.model("User", userSchema);
