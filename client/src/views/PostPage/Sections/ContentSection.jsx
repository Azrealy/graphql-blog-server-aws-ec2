import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
// @material-ui/icons
// core components
import GridContainer from "../../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../../material-components/Grid/GridItem.jsx";
import InfoArea from "../../../material-components/InfoArea/InfoArea.jsx";
import contentStyle from "../../../assets/jss/material-kit-react/views/landingPageSections/contentStyle.jsx";
import Typography from '@material-ui/core/Typography';


const hljs = window.hljs

class ContentSection extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { classes, post } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRounded,
      classes.imgFluid
    );
    const source = post.content
    const code = {
      code: (props) => {
        return (
          <pre >
            <code className={`language-${props.language}`}>
              {props.value}
            </code>
          </pre>
        )
    },
  }
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
          <img src={post.image} alt="..." className={imageClasses} />
            <ReactMarkdown renderers={code} className={classes.description} source={source}/>
            <Typography className={classes.description} component="a">
              This is the paragraph where you can write more details about your
              product. <a href='#'>Keep you user</a> engaged by providing meaningful
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
