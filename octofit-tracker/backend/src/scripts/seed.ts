import mongoose from 'mongoose';
import Activity from '../models/activity';
import Leaderboard from '../models/leaderboard';
import Team from '../models/team';
import User from '../models/user';
import Workout from '../models/workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [teamA, teamB] = await Team.create([
      {
        name: 'North Ridge Runners',
        city: 'Seattle',
        motto: 'Climb every mile together.',
      },
      {
        name: 'Bay City Lifters',
        city: 'San Francisco',
        motto: 'Stronger every session.',
      },
    ]);

    const users = await User.create([
      {
        name: 'Ava Martinez',
        email: 'ava.martinez@octofit.test',
        age: 29,
        fitnessLevel: 'advanced',
        team: teamA._id,
        totalPoints: 1480,
      },
      {
        name: 'Noah Kim',
        email: 'noah.kim@octofit.test',
        age: 34,
        fitnessLevel: 'intermediate',
        team: teamA._id,
        totalPoints: 1210,
      },
      {
        name: 'Zoe Chen',
        email: 'zoe.chen@octofit.test',
        age: 26,
        fitnessLevel: 'advanced',
        team: teamB._id,
        totalPoints: 1560,
      },
      {
        name: 'Liam Patel',
        email: 'liam.patel@octofit.test',
        age: 31,
        fitnessLevel: 'beginner',
        team: teamB._id,
        totalPoints: 890,
      },
    ]);

    teamA.members = [users[0]._id, users[1]._id];
    teamB.members = [users[2]._id, users[3]._id];
    await Promise.all([teamA.save(), teamB.save()]);

    await Activity.create([
      {
        user: users[0]._id,
        type: 'run',
        distanceKm: 10.2,
        durationMinutes: 58,
        calories: 640,
        date: new Date('2026-07-17T07:15:00Z'),
      },
      {
        user: users[1]._id,
        type: 'cycle',
        distanceKm: 22.8,
        durationMinutes: 72,
        calories: 710,
        date: new Date('2026-07-18T06:30:00Z'),
      },
      {
        user: users[2]._id,
        type: 'hiit',
        durationMinutes: 35,
        calories: 520,
        date: new Date('2026-07-19T18:10:00Z'),
      },
      {
        user: users[3]._id,
        type: 'strength',
        durationMinutes: 48,
        calories: 430,
        date: new Date('2026-07-20T17:20:00Z'),
      },
      {
        user: users[2]._id,
        type: 'yoga',
        durationMinutes: 42,
        calories: 210,
        date: new Date('2026-07-20T20:00:00Z'),
      },
    ]);

    const rankedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);
    await Leaderboard.create(
      rankedUsers.map((user, index) => ({
        user: user._id,
        points: user.totalPoints,
        rank: index + 1,
        weekLabel: '2026-W29',
      }))
    );

    await Workout.create([
      {
        user: users[0]._id,
        title: 'Tempo Run + Core',
        focusArea: 'Endurance',
        difficulty: 'hard',
        durationMinutes: 60,
        scheduledFor: new Date('2026-07-22T07:00:00Z'),
        completed: false,
      },
      {
        user: users[1]._id,
        title: 'Hill Repeats',
        focusArea: 'Cardio',
        difficulty: 'moderate',
        durationMinutes: 45,
        scheduledFor: new Date('2026-07-22T06:00:00Z'),
        completed: true,
      },
      {
        user: users[2]._id,
        title: 'Power Circuit',
        focusArea: 'Strength',
        difficulty: 'hard',
        durationMinutes: 50,
        scheduledFor: new Date('2026-07-23T18:00:00Z'),
        completed: false,
      },
      {
        user: users[3]._id,
        title: 'Mobility and Recovery',
        focusArea: 'Flexibility',
        difficulty: 'easy',
        durationMinutes: 30,
        scheduledFor: new Date('2026-07-23T19:30:00Z'),
        completed: true,
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
