import React ,{ Fragment }from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Warning from "@material-ui/icons/Warning";
// @material-ui/icons
import{ Link } from "react-router-dom";
// core components
import Badge from "../../../material-components/Badge/Badge.jsx";
import GridContainer from "../../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../../material-components/Grid/GridItem.jsx";
import Button from "../../../material-components/CustomButtons/Button.jsx";

import Paginations from "../../../material-components/Pagination/Pagination.jsx";
import postItemStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/postItemStyle.jsx";
import SnackbarContent from "../../../material-components/Snackbar/SnackbarContent.jsx";

const toIdHash = string => Buffer.from(string).toString('base64');

class PostItemSection extends React.Component {

  renderPostContainer = (classes, imageClasses) => {
    const { data, error } = this.props
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
    if ((data && data.posts.edges.length !== 0)) {

      return data.posts.edges.map((post) => {
        const data = new Date(Number(post.createdAt))
        return (
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
                      <Fragment><Badge color="primary" key={id}>#{name}</Badge></Fragment>
                    ))}
                  </h5>
                  <h5 className={classes.smallTitle}> Created by George at {data.toDateString()}</h5>
            </GridItem>
          </GridContainer>
          <br/><br/>
          </div> 
          )
      }) 
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
    const { classes } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRounded,
      classes.imgFluid
    );
    return (
      <div className={classes.section}>
        <div>
        <h2 className={classes.title}>Here is My blogs</h2>
        {this.renderPostContainer(classes, imageClasses)}
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
      </div>
    );
  }
}

export default withStyles(postItemStyle)(PostItemSection);
