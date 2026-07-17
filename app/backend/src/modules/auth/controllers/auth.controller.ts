import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../../shared/response";
import { loginUserService, registerUserService } from "../services/auth.service";
import { refreshTokenService } from "../services/auth.service";
import {logoutService} from "../services/auth.service"; 
import { sendOtpService } from "../services/auth.service"
import { verifyOtpService } from "../services/auth.service"

import { forgotPasswordService, resetPasswordService } from "../services/auth.service";
import { googleLoginService } from "../services/auth.service";


// Handle POST /api/auth/register
export const registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

     

        const user = await registerUserService(name, email, password);

        return sendSuccess(res, "User register Successfully", user, 201)
    } catch (error) {
        next(error)
    }
}


export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    

    // Browser/device info
    const userAgent = req.headers["user-agent"];

    // User IP address
    const ipAddress = req.ip;

    const result = await loginUserService(
      email,
      password,
      userAgent,
      ipAddress
    );

    return sendSuccess(
      res,
      "User logged in successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    const result = await refreshTokenService(refreshToken);

    return sendSuccess(
      res,
      "Access token refreshed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


// logout controller 

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body

    if(!refreshToken) {
      throw new Error("Refresh token is required")
    }

    await logoutService(refreshToken);
    return sendSuccess(res, "User logged out successfully");

  } catch (error) {
    next(error);
  }
}

// send otp controller
export const sendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    await sendOtpService(email)
    return sendSuccess(res, "OTP sent successfully to you email")

  } catch (error) {
    next(error)
  }
}

// verify otp controller 
export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;

        if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }

    await verifyOtpService(email, otp);

    return sendSuccess(res, "Email verified successfully");
  } catch (error) {
    next(error)
  }
}
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    await forgotPasswordService(email);

    return sendSuccess(
      res,
      "Password reset OTP sent successfully"
    );
  } catch (error) {
    next(error);
  }
};



export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;

    await resetPasswordService(email, otp, newPassword);

    return sendSuccess(
      res,
      "Password reset successfully"
    );
  } catch (error) {
    next(error);
  }
};





// Handles POST /api/auth/google
export const googleLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Google credential sent by the frontend
    const { credential } = req.body;

    // Browser/device information for session tracking
    const userAgent = req.headers["user-agent"];

    // IP address of the current request
    const ipAddress = req.ip;

    // Service verifies Google identity, finds/creates user,
    // generates tokens and creates a session
    const result = await googleLoginService(
      credential,
      userAgent,
      ipAddress
    );

    return sendSuccess(
      res,
      "Google login successful",
      result
    );
  } catch (error) {
    // Pass errors to the global error middleware
    next(error);
  }
};