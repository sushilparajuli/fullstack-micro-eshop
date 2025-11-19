// register a new user
import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRestrictions,
  sentOtp,
  trackOtpRequest,
  validateRegistrationData,
} from '../utils/auth.helper.js';

import { ValidationError } from '@packages/error-handler';

import { prisma } from '@packages/database/prisma';

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email, name } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError('User already exists'));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sentOtp(name, email, 'user-activation-mail');

    return next(
      res.status(200).json({
        message:
          'OTP sent to email for verification. Please verify your account',
      })
    );
  } catch (error) {
    return next(error);
  }
};
