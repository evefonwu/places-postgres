# Places-Postgres

Places API with PostgreSQL-backed GraphQL resolvers and Apollo Server

- create a place
- query all places
- query a place by uuid
- update a place
- delete a place

## Installation

#### Install Postgres

Download and install [Postgres](https://www.postgresql.org/download/)

Note credentials and name you choose for it during installation

For example, you named it 'local-db' at installation

#### Store your database credentials

Create a .env file at the root directory to store your database credentials

Open up pgAdmin, that came with the Postgres installation

Double-click 'local-db' and create a database under it named 'dev'

The example .env file would be:

```bash
HOST=localhost
PORT=5432
DB_NAME=dev
USERNAME=postgres
PASSWORD=yourpassword
```

#### Install node project dependencies

```bash
npm install
```

## Usage

Start the server with nodemon

```bash
npx nodemon ./graphql.js
```

Once the server starts, you should see the GraphQL playground running at http://localhost:4000

At GraphQL Playground, you can set your query variables, for example:

```json
{ "uuidString": "8f9dc39b-f638-4c25-b8d7-c6deda9e6644" }
```

```gql
mutation {
  createPlace(input: { name: "Cheryl", type: "Apartment", guests: "5" }) {
    uuid
    name
    type
    guests
  }
}

query {
  places {
    uuid
    name
    type
    guests
  }
}

query($uuidString: String!) {
  getPlace(uuid: $uuidString) {
    uuid
    name
    type
    guests
  }
}

mutation($uuidString: String!) {
  updatePlace(
    uuid: $uuidString
    input: { name: "Sherly", type: "House", guests: "8" }
  ) {
    uuid
    name
    type
    guests
  }
}

mutation($uuidString: String!) {
  deletePlace(uuid: $uuidString)
}
```

## Troubleshoot

Can't run the server

- Install node dependencies

```bash
npm install
```

Adding new GraphQL queries and data is not as expected

- Check SQL query for Postgres. For example, Postgres requires single quotes around string constants

- Does your GraphQL schema query parameters match your resolver function's second parameter? GraphQL resolver functions can receive four arguments, the second of which is the arguments from your schema query.

```gql
const typeDefs = gql`

  input PlaceInput {
    name: String!
    type: String!
    guests: String!
  }

  updatePlace(uuid: String!, input: PlaceInput!): Place
`;
```

```js
async function updatePlace(_, { uuid, input }) {
  //...
  await client.query(
    `UPDATE places SET name = $1, type = $2, guests = $3 WHERE uuid = $4 RETURNING id;`,
    [input.name, input.type, input.guests, uuid]
  );

  //...
}
```

## Roadmap

- More tables and data relationships?
- Data analytics queries?

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
