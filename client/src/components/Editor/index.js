import * as React from "react";
import ReactMde, { DraftUtil } from "react-mde";
import * as Showdown from "showdown";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import * as R from "ramda";
import AddTag from "./addTagButton";
import POST_FRAGMENT from "../../constants/fragments";
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';


const CREATE_POST = gql`
mutation($title: String!, $description: String!, $content: String!, $tags: [ID!]!){
    createPost(title: $title, description: $description, content: $content, tags: $tags){
      ...postContent
    }
}
${POST_FRAGMENT}
`

const INITIAL_STATE = {
  title: "",
  description: "",
  tagIds: []
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

class ReactMdeDemo extends React.Component {

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

      this.props.history.push(routes.LANDING)
    });

    event.preventDefault();
  };

  handleTagChange = event => {
    if (event.target.checked) {
      this.setState({ tagIds: [...this.state.tagIds, event.target.value]})
    } else {
      this.setState({ tagIds: this.state.tagIds.filter(id => id !== event.target.value)})
    }
  };

  generateMarkdownPreview = (markdown) => {
    return this.converter.makeHtml(markdown);
  };


  addPost = (client, {data: { createPost }}) => {
    const query  = gql`
        query PostQuery {
          posts {
            edges {
            ...postContent
            __typename
            }
          }
      }
      ${POST_FRAGMENT}
    `
    const posts = client.readQuery({ query  })
    client.writeQuery({
      query,
      data: {
        posts: {
          edges: R.append(posts, createPost),
          __typename: 'PostConnection'
        } 
      },
    })
  }

  render() {
    const { classes } = this.props
    const { title, description, tagIds } = this.state
    const { markdown } = this.state.mdeState
    console.log(this.state)
    const isInvalid = title === '' || description === '' || markdown === '' || tagIds.length === 0;
    return (
      
      <div>
        <Mutation 
          mutation={CREATE_POST} 
          variables={{ title, description, content: markdown, tags: tagIds }}
          update={this.addPost}>
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
                    value={tag.id}
                    onChange={(e) => this.handleTagChange(e)}
                    color="primary"
                  />
                }
                  label={tag.name}
                />
              </div>
            ))}
              <AddTag refetch={this.props.refetch}/>
            <h3>Content</h3>
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