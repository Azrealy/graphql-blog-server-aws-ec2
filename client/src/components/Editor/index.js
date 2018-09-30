import React from "react";
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
import Button from '@material-ui/core/Button';


const CREATE_POST = gql`
mutation($title: String!, $description: String!, $content: String!, $tags: [ID!]!){
    createPost(title: $title, description: $description, content: $content, tags: $tags){
      ...postContent
    }
}
${POST_FRAGMENT}
`

const UPDATE_POST = gql`
  mutation(
    $id: ID!, 
    $title: String!, 
    $description: String!, 
    $content: String!,
    $tags: [ID!]!)
    {
      updatePost(
        id: $id,
        title: $title,
        description: $description,
        content: $content, 
        tags: $tags){
          ...postContent
    }
  }
  ${POST_FRAGMENT}
`

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
      title: this.props.title || "",
      description: this.props.description || "",
      tagIds: this.props.tagIds || [],
      mdeState: {
        markdown: this.props.content || "",
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
      this.setState({ 
        title: "",
        description: "",
        tagsIds:[]
      });
      this.setState({ mdeState: { markdown: '' }})

      this.props.history.push(routes.LANDING)
    });

    event.preventDefault();
  };

  onUpdateSubmit = (event, updatePost) => {
    updatePost().then(async ({ data }) => {
      this.setState({
        title: "",
        description: "",
        tagsIds: []
      });
      this.setState({ mdeState: { markdown: '' } })
      this.props.handleClose()
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

  inputNode = (classes, loading) => {
    const { title, description, tagIds } = this.state
    const { markdown } = this.state.mdeState
    const isInvalid = title === '' || description === '' || markdown === '' || tagIds.length === 0;
    return (
    <div>
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
                checked={tagIds.includes(tag.id)}
                name={tag.name}
                value={tag.id}
                onChange={(e) => this.handleTagChange(e)}
                color="primary"
              />
            }
            label={tag.name}
          />
        </div>
      ))}
      <AddTag refetch={this.props.refetch} />
      <h3>Content</h3>
      <ReactMde
        layout="horizontal"
        onChange={this.onTextChange}
        editorState={this.state.mdeState}
        generateMarkdownPreview={this.generateMarkdownPreview}
      />
        <Button disabled={isInvalid || loading} type="submit" style={{ marginTop: 20 }}>
        Submit
      </Button>
    </div>
    )
  }

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

  updatePost = (client, { data: { updatePost:{ id }} }) => {
    const post = client.readFragment({
      id: `Post:${id}`,
      fragment: POST_FRAGMENT
    });
    console.log("Update post ", post)
  }

  render() {
    const { classes, isUpdate, id } = this.props
    const { title, description, tagIds } = this.state
    const { markdown } = this.state.mdeState
    console.log("State of editor", this.state)
    if (isUpdate) {
      return (
      <div>
        <Mutation
          mutation={UPDATE_POST}
            variables={{ id: id, title: title, description: description, content: markdown, tags: tagIds}}
          update={this.updatePost}>
          {(updatePost, { data, loading, error }) => (
            <form onSubmit={event => this.onUpdateSubmit(event, updatePost)} >
              {this.inputNode(classes, loading)}
                <Button onClick={() => this.props.handleClose()}> close</Button>
              {error && <ErrorMessage error={error} />}
            </form>)}
        </Mutation>
      </div>
      )
    } else {
    return (
      <div>
        <Mutation 
          mutation={CREATE_POST} 
          variables={{ title, description, content: markdown, tags: tagIds }}
          update={this.addPost}>
          {(createPost, { data, loading, error }) => (
            <form onSubmit={event => this.onSubmit(event, createPost)} >
              {this.inputNode(classes, loading)}
              {error && <ErrorMessage error={error} />}
          </form>)}
      </Mutation>
      </div>      
    )      
    }

  }
}

export default  withStyles(styles)(ReactMdeDemo)