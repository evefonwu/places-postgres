require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const {
  places,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} = require("./resolvers/database");

const typeDefs = gql`
  type Query {
    places: [Place]
    getPlace(uuid: String!): Place
  }

  type Mutation {
    createPlace(input: PlaceInput!): Place!
    updatePlace(uuid: String!, input: PlaceInput!): Place
    deletePlace(uuid: String!): String
  }

  input PlaceInput {
    name: String!
    type: String!
    guests: String!
  }

  type Place {
    uuid: String!
    name: String!
    type: String!
    guests: String!
  }
`;

const resolvers = {
  Query: {
    places,
    getPlace,
  },
  Mutation: {
    createPlace,
    updatePlace,
    deletePlace,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Database username: ${process.env.USERNAME}`);
  console.log(`Server running at ${url}`);
});
