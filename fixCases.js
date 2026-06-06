const mongoose = require('mongoose');
require('dotenv').config({ path: './Backend/.env' });

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await mongoose.connection.db.collection('users').findOne({ role: 'athlete' });
  if (user) {
    await mongoose.connection.db.collection('recoverycases').updateMany({}, { $set: { athleteId: user._id } });
    console.log('Updated cases to user:', user.name);
  } else {
    console.log('No athlete found');
  }
  process.exit(0);
}
fix();
