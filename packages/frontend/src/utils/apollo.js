import {
  createHttpLink,
  split,
  makeVar,
  ApolloClient,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import {
  getMainDefinition,
  relayStylePagination
} from '@apollo/client/utilities'

import possibleTypes from './possibleTypes.json'

import { GQL_URL, WS_URL, TOKEN_NAME } from '../config'

function loadToken () {
  return window.localStorage.getItem(TOKEN_NAME) != null
    ? window.localStorage.getItem(TOKEN_NAME)
    : ''
}

const currentUser = makeVar({})

const postFieldPolicies = {
  creator: {
    merge (existing, incoming) {
      return existing || incoming
    }
  },
  upvotes: {
    merge (_ignored, incoming) {
      return incoming
    }
  },
  downvotes: {
    merge (_ignored, incoming) {
      return incoming
    }
  }
}

const httpLink = createHttpLink({
  uri: GQL_URL
})

const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: loadToken()
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: loadToken()
    }
  }
})

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        postConnection: relayStylePagination(),
        currentUser: {
          read () {
            return currentUser()
          }
        },
        currentNetID: {
          read () {
            return currentUser().netID
          }
        },
        commentByPost: {
          merge (_existing, incoming) {
            return incoming
          }
        }
      }
    },
    Subscription: {
      fields: {
        postCreated: {
          merge (_ignored, incoming) {
            return incoming
          }
        },
        postVoteChanged: {
          merge (_ignored, incoming) {
            return incoming
          }
        },
        postRemoved: {
          merge (_ignored, incoming) {
            return incoming
          }
        }
      }
    },
    Discussion: {
      fields: postFieldPolicies
    },
    Event: {
      fields: postFieldPolicies
    },
    Job: {
      fields: postFieldPolicies
    },
    Notice: {
      fields: postFieldPolicies
    }
  }
})

const mainClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: cache
})

export { mainClient, currentUser, loadToken, cache }
