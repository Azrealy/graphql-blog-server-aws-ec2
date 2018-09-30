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

import headerLinksStyle from "../../assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import withSession from "../../components/Session/withSession";

const HeaderLinks = ({ session }) => (
  <div>
    {session && session.me ? (
      <HeaderLinksAuth session={session} />
    ) : (
        <HeaderLinksNonAuth />
      )}    
  </div>
)
const HeaderLinksNonAuth = withStyles(headerLinksStyle)(HeaderLinksBeforeAuth)

function HeaderLinksBeforeAuth({ ...props }) {
  const { classes } = props;
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
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              React
            </Link>,
            <Link to="/" className={classes.dropdownLink}>
            Javascript
          </Link>,
            <Link to="/" className={classes.dropdownLink}>
            Python
          </Link>,
          ]}
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
            href="#"
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
            href="#"
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
            href="#"
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
          <AccountCircle className={classes.icons} /><Link to="/posts" className={classes.navIconLink}> Contents Manager </Link>
        </Button>
      </ListItem>
          )
      }
      <ListItem className={classes.listItem}>
        <Button
          className={classes.navLink}
          onClick={e => e.preventDefault()}
          color="transparent"
        >
          <AccountCircle className={classes.icons} /><Link to="/account" className={classes.navIconLink}></Link>
        </Button>
      </ListItem>
    </List>
  );
}

export default withSession(HeaderLinks)
