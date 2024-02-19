import mongoose from 'mongoose';
import config from './config';

import User from './models/User';
import * as crypto from 'crypto';
import Task from './models/Task';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string,
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  try {
    const collections = ['tasks', 'users'];

    for (const collectionName of collections) {
      await dropCollection(db, collectionName);
    }

    await User.create([
      {
        username: 'user',
        password: '1@345qWert',
        token: crypto.randomUUID(),
      },
      {
        username: 'admin',
        password: 'l337@dmin',
        token: crypto.randomUUID(),
      },
    ]);

    const user = await User.findOne({ username: 'user' });
    const admin = await User.findOne({ username: 'admin' });

    await Task.create([
      {
        user: user._id,
        title: 'Test title',
        description: 'Test description',
        status: 'new',
      },
      {
        user: admin._id,
        title: 'Admin task',
        description: 'admin task description',
        status: 'new',
      },
    ]);

    await db.close();
  } catch (e) {
    console.log('Collection were missing, skipping drop');
  }
};

void run();
