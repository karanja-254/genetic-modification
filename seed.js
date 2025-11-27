require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./config/supabase');

async function seed() {
  console.log('Starting database seeding...');

  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('Creating admin user...');
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert([{
        email: 'admin@goms.com',
        password_hash: passwordHash,
        name: 'Admin User',
        age: 35,
        region: 'USA',
        role: 'admin'
      }])
      .select()
      .single();

    if (adminError && adminError.code !== '23505') {
      console.error('Error creating admin:', adminError);
    } else if (admin) {
      console.log('Admin user created:', admin.email);
    }

    console.log('Creating demo users...');
    const demoUsers = [
      { email: 'john@example.com', name: 'John Doe', age: 28, region: 'USA' },
      { email: 'jane@example.com', name: 'Jane Smith', age: 32, region: 'UK' },
      { email: 'bob@example.com', name: 'Bob Johnson', age: 45, region: 'Canada' },
      { email: 'alice@example.com', name: 'Alice Williams', age: 29, region: 'Australia' }
    ];

    for (const user of demoUsers) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: user.email,
          password_hash: passwordHash,
          name: user.name,
          age: user.age,
          region: user.region,
          role: 'user'
        }])
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error creating user ${user.email}:`, error);
      } else if (newUser) {
        console.log(`User created: ${newUser.email}`);

        const historyRecords = [
          { disease_name: 'Diabetes', relative: 'Father', notes: 'Type 2 diabetes diagnosed at age 50' },
          { disease_name: 'Heart Disease', relative: 'Grandfather', notes: 'Coronary artery disease' },
          { disease_name: 'Hypertension', relative: 'Mother', notes: 'High blood pressure' }
        ];

        for (const record of historyRecords.slice(0, Math.floor(Math.random() * 3) + 1)) {
          await supabase
            .from('family_history')
            .insert([{
              user_id: newUser.id,
              disease_name: record.disease_name,
              relative: record.relative,
              notes: record.notes
            }]);
        }
      }
    }

    console.log('Seeding completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('Admin: admin@goms.com / password123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('User: bob@example.com / password123');
    console.log('User: alice@example.com / password123');

  } catch (error) {
    console.error('Seeding error:', error);
  }
}

seed();
