require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
  console.log('Starting database seeding...');

  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('Creating admin user...');
    try {
      await db.query(
        'INSERT INTO users (email, password_hash, name, age, region, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin@goms.com', passwordHash, 'Admin User', 35, 'USA', 'admin']
      );
      console.log('Admin user created: admin@goms.com');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin:', error.message);
      }
    }

    console.log('Creating demo users...');
    const demoUsers = [
      { email: 'john@example.com', name: 'John Doe', age: 28, region: 'USA' },
      { email: 'jane@example.com', name: 'Jane Smith', age: 32, region: 'UK' },
      { email: 'bob@example.com', name: 'Bob Johnson', age: 45, region: 'Canada' },
      { email: 'alice@example.com', name: 'Alice Williams', age: 29, region: 'Australia' }
    ];

    for (const user of demoUsers) {
      try {
        const [result] = await db.query(
          'INSERT INTO users (email, password_hash, name, age, region, role) VALUES (?, ?, ?, ?, ?, ?)',
          [user.email, passwordHash, user.name, user.age, user.region, 'user']
        );

        console.log(`User created: ${user.email}`);

        const [newUserRows] = await db.query(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        const newUser = newUserRows[0];

        if (newUser) {
          const historyRecords = [
            { disease_name: 'Diabetes', relative: 'Father', notes: 'Type 2 diabetes diagnosed at age 50' },
            { disease_name: 'Heart Disease', relative: 'Grandfather', notes: 'Coronary artery disease' },
            { disease_name: 'Hypertension', relative: 'Mother', notes: 'High blood pressure' }
          ];

          const recordCount = Math.floor(Math.random() * 3) + 1;
          for (const record of historyRecords.slice(0, recordCount)) {
            await db.query(
              'INSERT INTO family_history (user_id, disease_name, relative, notes) VALUES (?, ?, ?, ?)',
              [newUser.id, record.disease_name, record.relative, record.notes]
            );
          }
          console.log(`  Added ${recordCount} family history records`);
        }
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`User ${user.email} already exists`);
        } else {
          console.error(`Error creating user ${user.email}:`, error.message);
        }
      }
    }

    console.log('\n✓ Seeding completed successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('Demo Accounts:');
    console.log('═══════════════════════════════════════');
    console.log('Admin: admin@goms.com / password123');
    console.log('User:  john@example.com / password123');
    console.log('User:  jane@example.com / password123');
    console.log('User:  bob@example.com / password123');
    console.log('User:  alice@example.com / password123');
    console.log('═══════════════════════════════════════\n');

    await db.end();
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    await db.end();
    process.exit(1);
  }
}

seed();
