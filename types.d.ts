import { Model } from 'mongoose';
import ObjectId = module;

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserField, unknown, UserMethods>;

export interface TaskData {
  user: ObjectId;
  title: string;
  description: string;
  status: string;
}

export interface UpdateData {
  title?: string;
  description?: string;
  status?: string;
}
