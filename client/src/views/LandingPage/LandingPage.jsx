import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Loading from "../../components/Loading";

// @material-ui/icons

// core components
import Header from "../../material-components/Header/Header.jsx";
import Footer from "../../material-components/Footer/Footer.jsx";
import GridContainer from "../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../material-components/Grid/GridItem.jsx";
import Button from "../../material-components/CustomButtons/Button.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";
import Parallax from "../../material-components/Parallax/Parallax.jsx";
import Paginations from "../../material-components/Pagination/Pagination.jsx";
import landingPageStyle from "../../assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import PostItemSection from "./Sections/PostItemSection.jsx";

const GET_POSTS_LIST = gql`
  {
    posts {
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
        endCursor
      }
    }
  }
`

class LandingPage extends React.Component {

  renderLoadingOrPostItem = (classes, loading, data, error) => {
    if (loading && !data.posts) {
      return (
      <div className={classes.container}>
        <Loading is Center={true} />
      </div>        
      )
    } else {
      return (
      <div className={classes.container}>
        <PostItemSection data={data} error={error}/>
      </div>
      )
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <Query
        query={GET_POSTS_LIST}
        notifyOnNetworkStatusChange={true}>
      {({ data, loading, error }) => (
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
        <Parallax filter image={require("../../assets/img/landing-bg.jpg")}>
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
          {this.renderLoadingOrPostItem(classes, loading, data, error)}
          <div className={classes.pagination}>
            <Paginations
              pages={[
                { text: "PREV" },
                { text: 1 },
                { text: 2 },
                { active: true, text: 3 },
                { text: 4 },
                { text: 5 },
                { text: "NEXT" }
              ]}
              color="primary"
            />
          </div>
        </div>
        <Footer />
      </div>
      )}
      </Query>

    );
  }
}

export default withStyles(landingPageStyle)(LandingPage);
