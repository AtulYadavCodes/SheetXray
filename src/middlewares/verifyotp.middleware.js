import redis from "../db/redis.js";
import errorhandler from "../utils/errorhandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const verifyotp = asyncHandler(async (req, res, next) => {
  const email = (req.body?.email || "").trim().toLowerCase();
  const otp = String(req.body?.otp || "").trim();

  if (!email || !otp) {
    throw new errorhandler(400, "Email and OTP are required");
  }

  const savedOtp = await redis.get(`otp${email}`);
  if (otp === savedOtp ) {
    await redis.del(`otp${email}`);
    next();
  } else {
    console.log(req.body.otp + " " + (await redis.get(`otp${req.body.email}`)));
    throw new errorhandler(500, "OTP verification failed or OTP expired");
  }
});

export { verifyotp };
