import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

let db: Database | null = null;

export async function getDatabase() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), "database.sqlite"),
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        price_per_day REAL NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_by TEXT,
        approved_at DATETIME
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER,
        admin_username TEXT,
        action TEXT,
        old_values TEXT,
        new_values TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (listing_id) REFERENCES listings(id)
      )
    `);
    await seedDatabase(db);
  }

  return db;
}

async function seedDatabase(db: Database) {
  const existingUsers = await db.get("SELECT COUNT(*) as count FROM users");
  if (existingUsers.count === 0) {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.run(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      ["admin", hashedPassword, "admin"]
    );
  }

  const existingListings = await db.get(
    "SELECT COUNT(*) as count FROM listings"
  );
  if (existingListings.count === 0) {
    const sampleListings = [
      {
        title: "Toyota Camry 2023",
        description: "Reliable sedan perfect for city driving",
        make: "Toyota",
        model: "Camry",
        year: 2023,
        price_per_day: 45.99,
        location: "New York, NY",
        image_url:
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        status: "pending",
      },
      {
        title: "BMW X5 2022",
        description: "Luxury SUV with premium features",
        make: "BMW",
        model: "X5",
        year: 2022,
        price_per_day: 89.99,
        location: "Los Angeles, CA",
        image_url:
          "https://images.unsplash.com/photo-1635990215241-4d2805d729bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        status: "approved",
      },
      {
        title: "Ford Mustang 2021",
        description: "Classic American muscle car",
        make: "Ford",
        model: "Mustang",
        year: 2021,
        price_per_day: 75.0,
        location: "Chicago, IL",
        image_url:
          "https://images.unsplash.com/photo-1625231334168-35067f8853ed?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        status: "rejected",
      },
    ];

    for (const listing of sampleListings) {
      await db.run(
        `
        INSERT INTO listings (title, description, make, model, year, price_per_day, location, image_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          listing.title,
          listing.description,
          listing.make,
          listing.model,
          listing.year,
          listing.price_per_day,
          listing.location,
          listing.image_url,
          listing.status,
        ]
      );
    }
  }
}
