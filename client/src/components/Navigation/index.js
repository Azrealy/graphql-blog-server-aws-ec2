import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOut';

const Navigation = ({ session }) => (
    <div>
      {session && session.me ? (
        <NavigationAuth session={session} />
      ) : (
        <NavigationNonAuth />
      )}
    </div>
  );


const NavigationAuth = ({ session }) => (
<ul>
    <li>
    <Link to={routes.LANDING}>Landing</Link>
    </li>
    <li>
    <Link to={routes.ACCOUNT}>Account ({session.me.username})</Link>
    </li>
    {session &&
    session.me &&
    session.me.role === 'ADMIN' && (
        <li>
          <Link to={routes.POSTS}>Post Manager </Link>
        </li>
    )}
    <li>
    <SignOutButton />
    </li>
</ul>
);

const NavigationNonAuth = () => (
    <ul>
      <li>
        <Link to={routes.LOGIN}>Sign In</Link>
      </li>
    </ul>
  );

export default Navigation;