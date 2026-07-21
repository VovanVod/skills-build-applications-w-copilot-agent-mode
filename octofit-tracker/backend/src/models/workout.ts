import { Schema, model, type InferSchemaType } from 'mongoose';

const workoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    focusArea: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'moderate', 'hard'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    scheduledFor: { type: Date, required: true },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

const Workout = model('Workout', workoutSchema);

export default Workout;
