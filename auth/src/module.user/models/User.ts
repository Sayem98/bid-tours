import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUserInput {
  name: {
    first: string;
    last: string;
  };
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: {
    city: string;
    street: string;
    zip: string;
  };
  photo?: string;
}

interface IUserDoc extends IUserInput, Document {
  role: string;
  passwordChangedAt?: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const UserSchema = new Schema<IUserDoc>({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value: string) {
        return value === this.password;
      },
      message: "Password and confirm password must be the same",
    },
  },
  phone: { type: String, required: true },
  address: {
    city: { type: String, required: true },
    street: { type: String, required: true },
    zip: { type: String, required: true },
  },
  photo: { type: String },
  role: { type: String, default: "user" },
  passwordChangedAt: { type: Date },
});

UserSchema.pre<IUserDoc>("save", async function (next) {
  if (!this.isModified("password")) return next();
  // this.password = bcrypt.hashSync(this.password, 12); // 12 cpu intensive?
  this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(12));
  this.confirmPassword = undefined!;

  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = model<IUserDoc>("User", UserSchema);

export { User, IUserInput, IUserDoc };
