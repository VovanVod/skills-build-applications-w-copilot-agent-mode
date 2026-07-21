import { Schema, model, type InferSchemaType } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['run', 'cycle', 'strength', 'yoga', 'hiit'],
    },
    distanceKm: { type: Number, min: 0 },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;

const Activity = model('Activity', activitySchema);

export default Activity;
