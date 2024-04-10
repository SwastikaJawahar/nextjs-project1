const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  movies,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}
async function seedMovies(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "movies" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        adult BOOLEAN NOT NULL,
        backdrop_path VARCHAR(255),
        genre_ids INTEGER[],
        original_language VARCHAR(10),
        original_title VARCHAR(255) NOT NULL,
        overview TEXT,
        popularity NUMERIC,
        poster_path VARCHAR(255),
        release_date DATE,
        title VARCHAR(255) NOT NULL,
        video BOOLEAN,
        vote_average NUMERIC,
        vote_count INTEGER
      )
    `);
    console.log(`Created "movies" table`);

    // Fetch movies using the updateMovies function
    //const movies = await updateMovies();

    // Insert data into the "movies" table
    const insertedMovies = await Promise.all(
      movies.map(async (movie) => {
        return client.query(
          `
          INSERT INTO movies (id, adult, backdrop_path, genre_ids, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING;
        `,
          [
            movie.id,
            movie.adult,
            movie.backdrop_path,
            movie.genre_ids,
            movie.original_language,
            movie.original_title,
            movie.overview,
            movie.popularity,
            movie.poster_path,
            movie.release_date,
            movie.title,
            movie.video,
            movie.vote_average,
            movie.vote_count,
          ],
        );
      }),
    );

    console.log(`Seeded ${insertedMovies.length} movies`);

    return {
      createTable,
      movies: insertedMovies,
    };
  } catch (error) {
    console.error('Error seeding movies:', error);
    throw error;
  }
}
async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
  await seedMovies(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
