import 'dotenv/config';
import React from "react";
import { render } from "react-dom";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./style.css";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { signOut } from "./components/SignOut";
import registerServiceWorker from './registerServiceWorker';

import App from "./App";


const httpLink = new HttpLink({
  uri: 'http://13.113.194.249/graphql',
})


const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem('token')
    return {
    headers: {
      ...headers,
      'x-token': token? token: '' ,
    },
  }});

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('GraphQL error', message);

      if (message) {
        if (localStorage.getItem('token')) {
          signOut(client);
        }
      }
    });
  }

  if (networkError) {
    console.log('Network error', networkError);

    if (networkError.statusCode === 401) {
      signOut(client);
    }
  }
});

// Compose all the link
const link = ApolloLink.from([authLink, errorLink, httpLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

const Index = () => (
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>
)

render(<Index />, document.getElementById("root"));

registerServiceWorker()