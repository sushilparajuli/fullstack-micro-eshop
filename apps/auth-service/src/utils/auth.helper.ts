import crypto from 'crypto';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ValidationError } from '../../../../packages/error-handler';
// eslint-disable-next-line @nx/enforce-module-boundaries
import redis from '../../../../packages/database/redis';
import { sendMail } from './sendMail';
import { NextFunction } from 'express';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    throw new ValidationError('Missing required registration fields');
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`opt_lock:${email}`)) {
    return next(
      new ValidationError(
        'Account is lock due to multiple failed OTP attempts. Please try again after 30 minutes'
      )
    );
  }
  if (await redis.get(`opt_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        'Too many OTP requests. Please wait 1 hour before requesting again.'
      )
    );
  }

  if (await redis.get(`opt_cooldown:${email}`)) {
    return next(
      new ValidationError('Please wait 1 minute before requesting a new OTP!')
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequestCount = Number(await redis.get(otpRequestKey)) || 0;

  if (otpRequestCount >= 3) {
    await redis.set(`opt_spam_lock:${email}`, 'locked', 'EX', 3600); // 1 hour lock
    return next(
      new ValidationError(
        'Account is lock due to multiple failed OTP attempts. Please try again after 1 hour'
      )
    );
  }

  await redis.set(otpRequestKey, otpRequestCount + 1, 'EX', 3600);
};

export const sentOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  // send email logic here
  await sendMail(email, 'Verify your email', template, { name, otp });
  // set otp expiry time to 10 minutes and save in redis db
  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
};
