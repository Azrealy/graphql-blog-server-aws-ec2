import React from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import PostTable from "../../components/PostTable";
// @material-ui/icons

// core components
import Header from "../../material-components/Header/Header.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";

import contentManagerPage from "../../assets/jss/material-kit-react/views/contentManagerPage.jsx";

// Sections for this page


class ContentManagerPage extends React.Component {

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="info"
          brand="George Fang"
          rightLinks={<HeaderLinks />}
          fixed
          {...rest}
        />
        <hr/>
        <hr/>
        <hr/>
        <h1 className={classes.title}>Welcome to my post CMS.</h1>
            <div>
            <PostTable />
            </div>
      </div>
    );
  }
}

export default withStyles(contentManagerPage)(ContentManagerPage);
