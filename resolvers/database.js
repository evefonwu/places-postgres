const { pool } = require("./config");

// generate unique identifiers
const { v4: uuid_v4 } = require("uuid");

// create table if it doesn't exist in the database
async function init(client) {
  const res = await client.query(`
  CREATE TABLE IF NOT EXISTS places
  (
      id serial not null PRIMARY KEY, 
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      uuid char(36) not null, 
      name varchar(100) not null,
      type varchar(100) not null,
      guests varchar(100) not null
  );  
  `);
}

// createPlace(input: PlaceInput!): Place! - Corresponding schema definition
async function createPlace(_, { input }) {
  const client = await pool.connect();
  try {
    await init(client);
    const newUUID = uuid_v4();
    await client.query(
      `INSERT INTO places (uuid, name, type, guests) VALUES($1, $2, $3, $4) RETURNING id`,
      [newUUID, input.name, input.type, input.guests]
    );
    return {
      uuid: newUUID,
      name: input.name,
      type: input.type,
      guests: input.guests,
    };
  } finally {
    client.release();
  }
}

// places: [Place]!
async function places(_, { uuid }) {
  const client = await pool.connect();
  try {
    await init(client);
    const result = await client.query(
      `SELECT id, uuid, name, type, guests FROM places`
    );
    if (!result.rows || result.rows.length === 0) return [];
    return result.rows;
  } finally {
    client.release();
  }
}

// getPlace(uuid: String!): Place
async function getPlace(_, { uuid }) {
  const client = await pool.connect();
  try {
    await init(client);
    let place = {};
    const result = await client.query(
      `SELECT id, uuid, name, type, guests FROM places WHERE uuid = $1`,
      [uuid]
    );
    if (!result.rows || result.rows.length === 0) return null;
    place.uuid = result.rows[0].uuid;
    place.name = result.rows[0].name;
    place.type = result.rows[0].type;
    place.guests = result.rows[0].guests;
    return place;
  } finally {
    client.release();
  }
}

// updatePlace(uuid: String!, input: PlaceInput!): Place
async function updatePlace(_, { uuid, input }) {
  const client = await pool.connect();
  try {
    await init(client);
    await client.query(
      `UPDATE places SET name = $1, type = $2, guests = $3 WHERE uuid = $4 RETURNING id;`,
      [input.name, input.type, input.guests, uuid]
    );
    return {
      uuid,
      name: input.name,
      type: input.type,
      guests: input.guests,
    };
  } finally {
    client.release();
  }
}

// deletePlace(uuid: String!): Place
async function deletePlace(_, { uuid }) {
  const client = await pool.connect();
  try {
    await init(client);
    await client.query(`DELETE FROM places WHERE uuid = $1`, [uuid]);
    return uuid;
  } finally {
    client.release();
  }
}

module.exports = {
  places,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
};
