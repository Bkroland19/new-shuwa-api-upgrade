import crypto from "crypto";

const secretAccessToken = crypto.randomBytes(32).toString("hex");
const secretRefreshToken = crypto.randomBytes(32).toString("hex");
console.table({ secretAccessToken, secretRefreshToken });
