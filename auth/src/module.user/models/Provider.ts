import { Schema, model, Document } from "mongoose";

interface Ilocation {
  lat: number;
  lng: number;
  spotId: string; // should be a linked to a tourSpot
}

interface IProviderInput {
  locations: Ilocation[];
}

interface IProviderDoc extends IProviderInput, Document {
  userId: string;
}

const ProviderSchema = new Schema<IProviderDoc>({
  userId: { type: String, required: true, unique: true },
  locations: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      spotId: { type: String, required: true },
    },
  ],
});

const Provider = model<IProviderDoc>("Provider", ProviderSchema);

export { Provider, IProviderInput, IProviderDoc };
