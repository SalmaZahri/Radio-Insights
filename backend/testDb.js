import db from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await db.connect();
    console.log('Database connection successful!');
    
    // Check if tables exist
    console.log('Checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check if radios table exists and its structure
    const radiosExists = tablesResult.rows.some(row => row.table_name === 'radios');
    if (radiosExists) {
      console.log('\nChecking radios table structure:');
      const radiosColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'radios'
      `);
      radiosColumns.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('\nWARNING: radios table does not exist!');
    }
    
    // Check if users table exists and its structure
    const usersExists = tablesResult.rows.some(row => row.table_name === 'users');
    if (usersExists) {
      console.log('\nChecking users table structure:');
      const usersColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      usersColumns.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('\nWARNING: users table does not exist!');
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    // Close the pool
    await db.end();
  }
}

testConnection();
