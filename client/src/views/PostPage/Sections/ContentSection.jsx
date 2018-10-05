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
                  inlineCode: (props) => {
                    return <code className={classes.codeInline}>{props.value}</code>
                  },
                  image: (props) => (
                    <GridItem xs={12} md={6} className={classes.itemGrid} >
                    <img className={imageClasses} src={props.src} alt={props.alt}/>
                    </GridItem>
                  )
              }}
            />
            
          </GridItem>
        </GridContainer>

      </div>
    );
  }
}

export default withStyles(contentStyle)(ContentSection);
