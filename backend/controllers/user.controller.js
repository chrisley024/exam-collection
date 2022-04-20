import { comparePassword, hashPassword } from "../helpers/auth";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  //validation
  if (!username || username.length < 2)
    return res
      .status(400)
      .send("Username is required & should be min of 2 characters");

  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required & should be min of 6 characters");

  if (!email) return res.status(400).send("A valid email is required");

  // check for unique username
  const usernameExist = await User.findOne({ username });
  if (usernameExist) return res.status(400).send("Username already exist");

  // check for unique email
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).send("Email already exist");

  // hash password
  const hashedPassword = await hashPassword(password);

  // create new user
  const newUser = new User({ username, email, password: hashedPassword });

  //save new user
  try {
    await newUser.save();

    const user = await User.findOne({ email });
    //create signed token
    const token = tokenFn(user);
    user.password = undefined;

    return res.json({
      user,
      token,
    });
  } catch (error) {
    console.log("Registration failed: ", error);
    return res.status(400).send("Error, Try again");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // is email registered?
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Email does not exist");
    // check password match
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    //create signed token
    const token = tokenFn(user);
    user.password = undefined;
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Try again");
  }
};

export const currentUser = async (req, res) => {
  try {
    await User.findById(req.user._id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

function tokenFn(user) {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
