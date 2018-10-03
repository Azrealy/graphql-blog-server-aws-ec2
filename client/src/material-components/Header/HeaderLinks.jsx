/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, AccountCircle } from "@material-ui/icons";

// core components
import CustomDropdown from "../CustomDropdown/CustomDropdown.jsx";
import Button from "../CustomButtons/Button.jsx";
import { ApolloConsumer } from 'react-apollo';
import headerLinksStyle from "../../assets/jss/material-kit-react/components/headerLinksStyle.jsx";
import { signOut } from "../../components/SignOut";
import withSession from "../../components/Session/withSession";
import withTagSession from "../../components/Session/withTagSession";
import * as routes from "../../constants/routes"

const HeaderLinks = ({ session }) => (
  <div>
    {session && session.me ? (
      <HeaderLinksAuth session={session} />
    ) : (
        <HeaderLinksNonAuth />
      )}    
  </div>
)

function HeaderLinksBeforeAuth({ ...props }) {
  const { classes, data } = props;

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
      <CustomDropdown
          noLiPadding
          buttonText="Category"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={Apps}
          dropdownList={
            data.tags.map((tag) => (
              <React.Fragment key={tag.id}>
                <Link to={`/filter/${tag.name}`} className={classes.dropdownLink}>
                  {tag.name}
                </Link>
              </React.Fragment>
            ))
          }
        />
      </ListItem>
      <ListItem className={classes.listItem}>
      <Button
        className={classes.navLink}
        onClick={e => e.preventDefault()}
        color="transparent"
      >
        <AccountCircle className={classes.icons} /><Link to="/profile" className={classes.navIconLink}> My Profile </Link>
      </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title="Follow me on Github"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="https://github.com/Azrealy"
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-github"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title="Follow me on facebook"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.facebook.com/profile.php?id=100006119539058"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow me on instagram"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.instagram.com/george_fang_kh/"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}

const HeaderLinksNonAuth = withStyles(headerLinksStyle)(withTagSession(HeaderLinksBeforeAuth))

const HeaderLinksAuth = withStyles(headerLinksStyle)(HeaderLinksAfterAuth)

function HeaderLinksAfterAuth({ ...props }) {
  const { classes, session } = props;
  return (
    <List className={classes.list}>
      {session && session.me && session.me.role === 'ADMIN' && (
      <ListItem className={classes.listItem}>
        <Button
          className={classes.navLink}
          onClick={e => e.preventDefault()}
          color="transparent"
        >
          <AccountCircle className={classes.icons} /><Link to={routes.CONTENT_MANAGER} className={classes.navIconLink}> Contents Manager </Link>
        </Button>
      </ListItem>
          )
      }
      <ListItem className={classes.listItem}>
        <ApolloConsumer>
          {client => (
        <Button
          className={classes.navLink}
          onClick = {() => signOut(client)}
          color="transparent">
          Logout
        </Button>)}
        </ApolloConsumer>
      </ListItem>
    </List>
  );
}

export default withSession(HeaderLinks)
