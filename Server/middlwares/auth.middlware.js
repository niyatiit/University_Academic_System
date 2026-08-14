import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  console.log("Middleware HIT");
  console.log("Authorization Header:", req.headers.authorization); // 👈 add this

  try {
    let token;

    // console.log("Auth Header:", req.headers.authorization);
    //token comes as : "Bearer <token>" in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // console.log("Extracted Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided " });
    }

    //verify token

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decode Id : ", decode);

    //Attach user to request (excluding password)
    req.user = await User.findById(decode.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found , authorization denied" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};

export default protect;
