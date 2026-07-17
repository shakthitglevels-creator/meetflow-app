// src/modules/users/repositories/user.repository.ts

import { User } from "../../../users/user.model";

// Find one user using their email
export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

// Find one user using their MongoDB ID
export const findUserById = async (userId: string) => {
  return User.findById(userId);
};