// this file responsibility 
// Talk to Google
// Verify credential
// Return verified identity

// Google's official Node.js authentication library
import { OAuth2Client } from "google-auth-library";

import { env } from "../../../config/env";

// Create one reusable Google OAuth client
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// Shape of the verified identity returned to our service
export type GoogleUserInfo = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

// Verify credential received from the frontend
export const verifyGoogleCredential = async (
  credential: string
): Promise<GoogleUserInfo> => {
  // Google verifies the signature, expiry and client ID
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  // Read the verified data from Google's token
  const payload = ticket.getPayload();

  // Stop if Google did not return the required identity fields
  if (!payload?.sub || !payload.email || !payload.name) {
    throw new Error("Invalid Google account information");
  }

  return {
    // `sub` is Google's stable unique ID for this user
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
  };
};