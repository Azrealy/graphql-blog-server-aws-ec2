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
import Header from "../../material-components/Header/Header.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";


const CREATE_POST = gql`
mutation($title: String!, $description: String!,$image: String!, $content: String!, $tags: [ID!]!){
    createPost(title: $title, description: $description, image: $image, content: $content, tags: $tags){
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
    $image: String!, 
    $content: String!,
    $tags: [ID!]!)
    {
      updatePost(
        id: $id,
        title: $title,
        description: $description,
        image: $image,
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
      image: this.props.image || "",
      tagIds: this.props.tagIds || [],
      contentState: {
        markdown: this.props.content || "",
      },
      descriptionState: {
        markdown: this.props.description || "",
      }
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

  onContentChange = contentState => {
    this.setState({ contentState });
  };

  onDescriptionChange = descriptionState => {
    this.setState({ descriptionState })
  } 

  onSubmit = (event, createPost) => {
    createPost().then(async ({ data }) => {
      this.setState({ 
        title: "",
        image: "",
        tagsIds:[]
      });
      this.setState({ contentState: { markdown: '' }})
      this.setState({ descriptionState: { markdown: ''}})

      this.props.history.push(routes.CONTENT_MANAGER)
    });

    event.preventDefault();
  };

  onUpdateSubmit = (event, updatePost) => {
    updatePost().then(async ({ data }) => {
      this.setState({
        title: "",
        image: "",
        tagsIds: []
      });
      this.setState({ contentState: { markdown: '' }})
      this.setState({ descriptionState: { markdown: ''}})

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

  inputForm = (classes, loading, title, image, tagIds, isInvalid) => {
    return (
    <div>
      <h3>Title</h3>
      <div className={classes.container}>
        <TextField
          id="filled-name"
          label="Input your post title"
          className={classes.textField}
          value={title}
          onChange={(e) => this.onChange(e)}
          name="title"
          fullWidth
          margin="normal"
          variant="filled"
        />
      </div>
      <h3>Image Link</h3>
      <div className={classes.container}>
        <TextField
          id="filled-name"
          label="Input your image url"
          className={classes.textField}
          value={image}
          name="image"
          onChange={(e) => this.onChange(e)}
          fullWidth
          margin="normal"
          variant="filled"
        />
        <img src={image} alt="No picture"/>
      </div>
      <h3>Description</h3>
        <ReactMde
          layout="vertical"
          onChange={this.onDescriptionChange}
          editorState={this.state.descriptionState}
          generateMarkdownPreview={this.generateMarkdownPreview}
        />

      <h3>Tags</h3>
      {this.props.tags.map((tag) => (
        <React.Fragment key={tag.id}>
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
        </React.Fragment>
      ))}
      <AddTag refetch={this.props.refetch} />
      <h3>Content</h3>
      <ReactMde
        layout="horizontal"
        onChange={this.onContentChange}
        editorState={this.state.contentState}
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
    const { classes, isUpdate, id , ...rest} = this.props
    const { title, tagIds, image } = this.state
    const description = this.state.descriptionState.markdown
    const content = this.state.contentState.markdown
    const isInvalid = title === '' || image === '' || description === '' || content === '' || tagIds.length === 0
    console.log("State of editor", this.state)
    if (isUpdate) {
      return (
      <div>
        <Mutation
          mutation={UPDATE_POST}
          variables={{ 
            id: id, 
            title: title, 
            description: description, 
            image: image, 
            content: content, 
            tags: tagIds}}
          update={this.updatePost}>
          {(updatePost, { data, loading, error }) => (
            <form onSubmit={event => this.onUpdateSubmit(event, updatePost)} >
              {this.inputForm(classes, loading, title, image, tagIds, isInvalid)}
                <Button onClick={() => this.props.handleClose()}> close</Button>
              {error && <ErrorMessage error={error} />}
            </form>)}
        </Mutation>
      </div>
      )
    } else {
    return (
      <div>
        <Header
          color="info"
          brand="George Fang"
          rightLinks={<HeaderLinks />}
          fixed
          {...rest}
        />
        <br/><br/><br/><br/>
        <Mutation 
          mutation={CREATE_POST} 
          variables={{ title, description, image, content, tags: tagIds }}
          update={this.addPost}>
          {(createPost, { data, loading, error }) => (
            <form onSubmit={event => this.onSubmit(event, createPost)} >
              {this.inputForm(classes, loading, title, image, tagIds, isInvalid)}
              {error && <ErrorMessage error={error} />}
          </form>)}
      </Mutation>
      </div>      
    )      
    }

  }
}

export default  withStyles(styles)(ReactMdeDemo)