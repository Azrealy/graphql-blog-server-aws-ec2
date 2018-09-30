import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import{ Link } from "react-router-dom";
// core components
import Badge from "../../../material-components/Badge/Badge.jsx";
import GridContainer from "../../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../../material-components/Grid/GridItem.jsx";
import Button from "../../../material-components/CustomButtons/Button.jsx";

import postItemStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/postItemStyle.jsx";

import image from "../../../assets/img/bg.jpg";
import image2 from "../../../assets/img/bg2.jpg";
import image3 from "../../../assets/img/bg3.jpg";

class PostItemSection extends React.Component {
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
          <GridContainer>
                <GridItem xs={12} md={4} className={classes.itemGrid}>
                <Link to="/blog">
                <img src={image} alt="..." className={imageClasses} />
                </Link>
                </GridItem>

                <GridItem xs={12} md={8} className={classes.itemGrid}>

                  <h2 className={classes.cardTitle}> 
                  <Link to="/blog" className={classes.link}>
                  My first Article
                  </Link>
                  </h2>
                  <h5 className={classes.description}>
                    You can write here details about one of your team members.
                    You can give more details about what they do. Feel free to
                    add some links for people to be able to
                    follow them outside the site.
                    </h5>
                    <h5 className={classes.smallTitle}> Tag: <Badge color="primary" >#Feeling</Badge></h5>
                    <h5 className={classes.smallTitle}> Created by George at 2 two hours ago</h5>
                  </GridItem>
            </GridContainer>
            <br/><br/>
            <GridContainer>
                <GridItem xs={12} md={4} className={classes.itemGrid}>
                  <img src={image2} alt="..." className={imageClasses} />
                </GridItem>
                <GridItem xs={12} md={8} className={classes.itemGrid}>
                <h2 className={classes.cardTitle}> 
                  <Link to="/blog" className={classes.link}>
                  My first Article
                  </Link>
                  </h2>
                  <h5 className={classes.description}>
                    You can write here details about one of your team members.
                    You can give more details about what they do. Feel free to
                    add some links for people to be able to
                    follow them outside the site.
                    </h5>
                    <h5 className={classes.smallTitle}> Tag: <Badge color="primary" >#Feeling</Badge></h5>
                    <h5 className={classes.smallTitle}> Created by George at 2 two hours ago</h5>
                  </GridItem>
            </GridContainer>
            <br/><br/>
            <GridContainer>
                <GridItem xs={12} md={4} className={classes.itemGrid}>
                  <img src={image3} alt="..." className={imageClasses} />
                </GridItem>
                <GridItem xs={12} md={8} className={classes.itemGrid}>
                <h2 className={classes.cardTitle}> 
                  <Link to="/blog" className={classes.link}>
                  My first Article
                  </Link>
                  </h2>
                  <h5 className={classes.description}>
                    You can write here details about one of your team members.
                    You can give more details about what they do. Feel free to
                    add some <a href="#pablo">links</a> for people to be able to
                    follow them outside the site.
                    <h5 className={classes.smallTitle}> Tag: <Badge color="info" >#Javascript</Badge></h5>
                    <h5 className={classes.smallTitle}> Created by George at 2 two hours ago</h5>
                  </h5>
                  </GridItem>
            </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(postItemStyle)(PostItemSection);
