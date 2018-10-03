import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
// @material-ui/icons
// core components
import GridContainer from "../../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../../material-components/Grid/GridItem.jsx";
import contentStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/contentStyle.jsx";
import Typography from '@material-ui/core/Typography';
import codeRenderer from './code-renderer';


class ContentSection extends React.Component {


  render() {
    const { classes, post } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRounded,
      classes.imgFluid
    );
    const source = post.content
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
          <img src={post.image} alt="..." className={imageClasses} />
            <ReactMarkdown
              source={source}
              renderers={{
                  code: codeRenderer,
              }}
            />
            <Typography className={classes.description} component="a">
              This is the paragraph where you can write more details about your
              product. engaged by providing meaningful
              information. Remember that by this time, the user is curious,
              otherwise he wouldn't scroll to get here. Add a button if you want
              the user to see more.
            </Typography>
          </GridItem>
        </GridContainer>

      </div>
    );
  }
}

export default withStyles(contentStyle)(ContentSection);
