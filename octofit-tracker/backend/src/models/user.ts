import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 13, max: 100 },
    fitnessLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    totalPoints: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

const User = model('User', userSchema);

export default User;
