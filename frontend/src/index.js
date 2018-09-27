import 'dotenv/config';
import React from "react";
import { render } from "react-dom";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./style.css";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from './components/App';
import { signOut } from "./components/SignOut";
import registerServiceWorker from './registerServiceWorker';


const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql',
})

/* const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql`,
  options: {
    reconnect: true,
  }
}) */

// When the operation is subscription, split the Websocket link and http Link.
/* const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
); */

// Set token header before every Link.
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

      if (message === 'NOT_AUTHENTICATED') {
        signOut(client);
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
);

render(<Index />, document.getElementById("root"));

registerServiceWorker()