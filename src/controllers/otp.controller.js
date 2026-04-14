import crypto from "crypto";
import redis from "../db/redis.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import responseHandler from "../utils/responseHandler.js";
import transporter from "../utils/mailtransport.js";
import errorhandler from "../utils/errorhandler.js";
import { emailtemplate } from "../utils/emailtemplate.js";

const createotpandmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999);
  await redis.set(`otp${email}`, otp, "EX", 240);

  await nodemailermethod(email, otp);
  //ratelimiter
  const key = `otp${email}${req.ip}`;
  await redis.incr(key);
  await redis.expire(key, 60);
  return res
    .status(200)
    .json(new responseHandler(200, "OTP sent to email", null));
});

const nodemailermethod = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: '"Team SheetXray" <academics.atul@gmail.com>', // sender address
      to: `${email}`, // list of recipients
      subject: "SheetXray verification code",
      text: `${otp}`,
      html: emailtemplate(otp),
    });

    return;
  } catch (err) {
    throw new errorhandler(500, "Error while sending mail:", err);
  }
};
export { createotpandmail };
