import React, { Fragment } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import gql from "graphql-tag";
import { Query } from 'react-apollo';
import Loading from "../../components/Loading";
// @material-ui/icons

// core components
import Header from "../../material-components/Header/Header.jsx";
import Footer from "../../material-components/Footer/Footer.jsx";
import GridContainer from "../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../material-components/Grid/GridItem.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";
import Parallax from "../../material-components/Parallax/Parallax.jsx";
import Warning from "@material-ui/icons/Warning";

import postPage from "../../assets/jss/material-kit-react/views/postPage.jsx";
import SnackbarContent from "../../material-components/Snackbar/SnackbarContent.jsx";
// Sections for this page
import ContentSection from "./Sections/ContentSection.jsx";


const GET_POST = gql`
  query($id: ID!) {
    post(id: $id) {
      id
      title
      description
      image
      content
      tags {
        id
        name
      }
    }
  }
`

const fromIdHash = string =>
  Buffer.from(string, 'base64').toString('ascii');



class PostPage extends React.PureComponent {

  renderPostContent = (classes, data, loading, error) => {
    const { post } = data
    if (loading && !post ) {
      return <Loading isCenter={true} />;
    }
    if (error) {
      return (
      <SnackbarContent
        message={
          <span>
            <b>WARNING ALERT:</b> Server Error, Try to refresh your browser!
          </span>}
        close
        color="warning"
        icon={Warning} />
      )
    }
    return (
      <Fragment>
      <Parallax filter image={require("../../assets/img/landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h1 className={classes.title}>{post.title}</h1>
              <h4>
              {post.description}
              </h4>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
          <ContentSection post={post} />
      </div>
      </Fragment>
    )
  }

  render() {
    const id = fromIdHash(this.props.match.params.hash)
    const { classes, ...rest } = this.props;
    return (
      <Query
        query={GET_POST}
        notifyOnNetworkStatusChange={true}
        variables={{id: id}}>
      {({data, loading, error}) => (
        <div>
          <Header
            color="transparent"
            brand="George Fang"
            rightLinks={<HeaderLinks />}
            fixed
            changeColorOnScroll={{
              height: 400,
              color: "info"
            }}
            {...rest}
          />
          {this.renderPostContent(classes, data, loading, error)}
          <Footer />
        </div>        
      )}
      </Query>
    );
  }
}

export default withStyles(postPage)(PostPage);
