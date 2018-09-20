import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENT from './message';

export const EVENTS = {
    MESSAGE: MESSAGE_EVENT
}

export default new PubSub();