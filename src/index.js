import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const app = express();

// Apply middleware to express server
app.use(cors());

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    nameFull: String!
    nameFullWithMiddleName: String!
    nameFirst: String!
    nameMiddle: String
    nameLast: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

let users = {
  1: {
    id: "1",
    username: "Sebastian Pieczyński"
  },
  2: {
    id: "2",
    username: "Dave Davids"
  }
};

let messages = {
  1: {
    id: "1",
    text: "Hello World"
  },
  2: {
    id: "2",
    text: "Bye World"
  }
};

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id } = args) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id } = args) => {
      return messages[id];
    }
  },
  Message: {
    user: (parent, args, { me } = args) => {
      return me;
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });
app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
