import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import tagSchema from './tag';
import postSchema from './post';


const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema, 
  userSchema,
  messageSchema, 
  tagSchema, 
  postSchema];