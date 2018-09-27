import * as React from "react";
import ReactMde, { DraftUtil } from "react-mde";
import * as Showdown from "showdown";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import ErrorMessage from '../Error';

const CREATE_POST = gql`
mutation($title: String!, $description: String!, $text: String!, $tags: [String!]!){
    createPost(title: $title, description: $description, text: $text, tags: $tags){
      id
      title
      description
      tags {
        id
        text
      }
      createdAt
    }
  }`

const INITIAL_STATE = {
  title: "",
  description: "",
  tags: []
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

export class ReactMdeDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      mdeState: {
        markdown: '',
      },
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
  }

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onTextChange = mdeState => {
    this.setState({ mdeState });
  };

  onSubmit = (event, createPost) => {
    createPost().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });
      this.setState({ mdeState: { markdown: '' }})
      console.log(data.createPost)
    });

    event.preventDefault();
  };

  handleTagChange = event => {
    if (event.target.checked) {
      this.setState({ tags: [...this.state.tags, event.target.value]})
    } else {
      this.setState({ tags: this.state.tags.filter(value => value !== event.target.value)})
    }
  };

  generateMarkdownPreview = (markdown) => {
    return this.converter.makeHtml(markdown);
  };


  render() {
    const { classes } = this.props
    const { title, description, tags } = this.state
    const { markdown } = this.state.mdeState
    console.log(this.state)
    const isInvalid = title === '' || description === '' || markdown === '' || tags.length === 0;
    return (
      
      <div>
        <Mutation mutation={CREATE_POST} variables={{ title, description, text: markdown, tags }}>
          {(createPost, { data, loading, error }) => (
            <form onSubmit={event => this.onSubmit(event, createPost)} >
            <div className={classes.container}>
            <TextField
              id="filled-name"
              label="Title"
              className={classes.textField}
              value={title}
              onChange={(e) => this.onChange(e)}
              name="title"
              fullWidth
              margin="normal"
              variant="filled"
            />
            <TextField
              id="filled-name"
              label="Description"
              className={classes.textField}
              value={description}
              name="description"
                  onChange={(e) => this.onChange(e)}
              fullWidth
              margin="normal"
              variant="filled"
            />
            </div>
            <h3>Tags</h3>
            {this.props.tags.map((tag) => (
              <div key={tag.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={tag.text}
                    onChange={(e) => this.handleTagChange(e)}
                    color="primary"
                  />
                }
                  label={tag.text}
                />
              </div>
            ))}
            <h3>Text</h3>
            <ReactMde
              layout="horizontal"
              onChange={this.onTextChange}
              editorState={this.state.mdeState}
              generateMarkdownPreview={this.generateMarkdownPreview}
            />
              <button disabled={isInvalid || loading} type="submit" style={{ marginTop: 20 }}>
              Submit
            </button>
              {error && <ErrorMessage error={error} />}
          </form>)}
      </Mutation>
      </div>
    );
  }
}

export default  withStyles(styles)(ReactMdeDemo)