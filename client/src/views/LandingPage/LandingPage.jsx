import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Loading from "../../components/Loading";
import Warning from "@material-ui/icons/Warning";
// @material-ui/icons

// core components
import SnackbarContent from "../../material-components/Snackbar/SnackbarContent.jsx";
import Header from "../../material-components/Header/Header.jsx";
import Footer from "../../material-components/Footer/Footer.jsx";
import GridContainer from "../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../material-components/Grid/GridItem.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";
import Parallax from "../../material-components/Parallax/Parallax.jsx";
import landingPageStyle from "../../assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import PostItemSection from "./Sections/PostItemSection.jsx";

const GET_POSTS_LIST = gql`
  query($forward: Boolean, $cursor: String, $limit: Int){
    posts(forward: $forward, cursor: $cursor, limit: $limit) {
      edges {
        id
        title
        description
        image
        createdAt
        tags {
          id
          name
        }
      }
      postInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`

class LandingPage extends React.Component {


  renderLoadingOrPostItem = (classes, loading, data, error, fetchMore, filterType) => {
    if (loading && !data.posts) {
      return (
      <div className={classes.container}>
        <Loading isCenter={true} />
      </div>        
      )
    } 
    if ((data && data.posts.edges.length !== 0)) {
      const { posts } = data
      return (
      <div className={classes.container}>
        <PostItemSection posts={posts} loading={loading} fetchMore={fetchMore} filterType={filterType}/>
      </div>
      )
    } else {
      return (
        <SnackbarContent
          message={
            <span>
              <b>WARNING ALERT:</b> Post like disappeared! Try to refresh your browser!
            </span>}
          close
          color="warning"
          icon={Warning} />
        )
    }
  }

  render() {
    const { classes, match, ...rest } = this.props;
    const filterType = match ? match.params.type: null

    return (
      <Query
        query={GET_POSTS_LIST}
        variables={{forward: false, cursor: "", limit: 5}}
        notifyOnNetworkStatusChange={true}>
      {({ data, loading, error,fetchMore }) => (
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
            <Parallax filter image={"https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/42859850_1740969936001844_4230365163892506624_o.jpg?_nc_cat=109&oh=a18f376834c75f79b7f363c48b3d6444&oe=5C14F2F8"}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={5}>
                <h1 className={classes.title}>Your Story Starts With Us.</h1>
                <h4>
                  Every landing page needs a small description after the big
                  bold title, that's why we added this text here. Add here all
                  the information that can make you or your product create the
                  first impression.
                </h4>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          {this.renderLoadingOrPostItem(classes, loading, data, error, fetchMore, filterType)}
        </div>
        <Footer />
      </div>
      )}
      </Query>

    );
  }
}

export default withStyles(landingPageStyle)(LandingPage);
