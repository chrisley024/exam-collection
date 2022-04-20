import expressJwt from "express-jwt";

//verify token
export const requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
