import React ,{ Fragment }from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Warning from "@material-ui/icons/Warning";
// @material-ui/icons
import{ Link } from "react-router-dom";
// core components
import * as R from "ramda";
import Badge from "../../../material-components/Badge/Badge.jsx";
import GridContainer from "../../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../../material-components/Grid/GridItem.jsx";
import Button from "../../../material-components/CustomButtons/Button.jsx";
import FetchMore from "../../../components/FetchMore";
import Paginations from "../../../material-components/Pagination/Pagination.jsx";
import postItemStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/postItemStyle.jsx";
import SnackbarContent from "../../../material-components/Snackbar/SnackbarContent.jsx";

const toIdHash = string => Buffer.from(string).toString('base64');

class PostItemSection extends React.Component {

  getUpdateQuery = (
    previousResult,
    { fetchMoreResult },
  ) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    
    return {
      ...previousResult,
      posts: {
        ...previousResult.posts,
        ...fetchMoreResult.posts,
        edges: [
          ...previousResult.posts.edges,
          ...fetchMoreResult.posts.edges
        ]
      }
    }
  };

  renderPostContainer = (classes, imageClasses, posts, filterType) => {

      if (filterType) {
        return posts.edges.filter((post) => {
          const tag = post.tags.filter(tag => tag.name === filterType)
          if (tag.length) {
            return true
          } else {
            false
          }
        }).map(
          (post) =>  {
            const data = new Date(Number(post.createdAt))
            return(
              <div key={post.id}>
              <GridContainer>
                <GridItem xs={12} md={4} className={classes.itemGrid}>
                  <Link to={`/posts/${toIdHash(post.id)}`}>
                  <img src={post.image} alt="..." className={imageClasses} />
                  </Link>
                  </GridItem>
    
                  <GridItem xs={12} md={8} className={classes.itemGrid}>
    
                    <h2 className={classes.cardTitle}> 
                    <Link to={`/posts/${toIdHash(post.id)}`} className={classes.link}>
                    {post.title}
                    </Link>
                    </h2>
                    <h5 className={classes.description}>
                      {post.description}
                      </h5>
                      <h5 className={classes.smallTitle}>
                        Tag: {post.tags.map(({ id, name }) => (
                          <Fragment key={id}><Badge color="primary" >#{name}</Badge></Fragment>
                        ))}
                      </h5>
                      <h5 className={classes.smallTitle}> Created by George at {data.toDateString()}</h5>
                </GridItem>
              </GridContainer>
              <br/><br/>
              </div> 
          )}          
        )
      } else {
      return posts.edges.map((post) =>  {
        const data = new Date(Number(post.createdAt))
        return(
          <div key={post.id}>
          <GridContainer>
            <GridItem xs={12} md={4} className={classes.itemGrid}>
              <Link to={`/posts/${toIdHash(post.id)}`}>
              <img src={post.image} alt="..." className={imageClasses} />
              </Link>
              </GridItem>

              <GridItem xs={12} md={8} className={classes.itemGrid}>

                <h2 className={classes.cardTitle}> 
                <Link to={`/posts/${toIdHash(post.id)}`} className={classes.link}>
                {post.title}
                </Link>
                </h2>
                <h5 className={classes.description}>
                  {post.description}
                  </h5>
                  <h5 className={classes.smallTitle}>
                    Tag: {post.tags.map(({ id, name }) => (
                      <Fragment key={id}><Badge color="primary" >#{name}</Badge></Fragment>
                    ))}
                  </h5>
                  <h5 className={classes.smallTitle}> Created by George at {data.toDateString()}</h5>
            </GridItem>
          </GridContainer>
          <br/><br/>
          </div> 
      )})        
      }
  }

  render() {
    const { classes, fetchMore, posts, loading, filterType } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRounded, 
      classes.imgFluid
    );
    return (
      <div className={classes.section}>
        <div>
        <h2 className={classes.title}>Here is My blogs</h2>
        {this.renderPostContainer(classes, imageClasses, posts, filterType)}
        <div className={classes.pagination}>
        <FetchMore
          loading={loading}
          hasNextPage={posts.postInfo.hasNextPage}
          variables={{
            cursor: posts.postInfo.endCursor,
            limit: 5
          }}
          updateQuery={this.getUpdateQuery}
          fetchMore={fetchMore}
        >
          Post
        </FetchMore>
        </div>
        </div>
      </div>
    );
  }
}

export default withStyles(postItemStyle)(PostItemSection);
