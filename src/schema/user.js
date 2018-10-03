import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
      deleteUser(id: ID!): Boolean!
      signIn(
          login: String!
          password: String!
      ): Token!
  }

  type Token {
      token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }
`;