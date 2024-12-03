import { model, Document, Schema } from "mongoose";

export interface Token {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenModel extends Token, Document {}
const tokenSchema = new Schema<TokenModel>({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

const Token = model<TokenModel>("Token", tokenSchema);

export { Token };
