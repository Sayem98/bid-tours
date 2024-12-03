import { User } from "./models/User";
import type { IUserInput } from "./models/User";
export { IUserInput };

export const createUser = async (data: IUserInput) => {
  //create a new user
  const user = new User(data);
  //save the user
  await user.save();
  return user;
};

export const getUser = async (email: string, needPassword: boolean) => {
  // return user without password
  return await User.findOne({ email }).select(
    needPassword ? "+password" : "-password"
  );
};
