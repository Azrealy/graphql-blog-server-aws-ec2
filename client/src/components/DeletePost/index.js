import React from "react";
import { Mutation } from 'react-apollo';
import gql from "graphql-tag";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import POST_FRAGMENT from "../../constants/fragments";
import Button from '@material-ui/core/Button';

const DELETE_POST = gql`
    mutation($id: ID!) {
        deletePost(id: $id)
    }
`

class DeletePost extends React.Component {

    onClick = (event, deletePost) => {
        deletePost().then(async ({data}) => {
            console.log(data)
        })
        event.preventDefault();
    }
    deletePostUpdate = (client) => {
        const query = gql`
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
    const { posts } = client.readQuery({ query })
    console.log("posts in the deletpost", posts)
    client.writeQuery({
        query,
        data: {
            posts: {
                edges: posts.edges.filter((post) => post.id !== this.props.id),
                __typename: 'PostConnection'
            }
        },
    })
    }

    render() {
        return (
            <Mutation
                mutation={DELETE_POST}
                variables={{id: this.props.id}}
                update={this.deletePostUpdate}
                >
                {(deletePost, { data, loading, error }) => (
                    <Button variant= "contained"
                        onClick={(event) => this.onClick(event, deletePost)}
                    ><DeleteRoundedIcon/></Button>
                )}
            </Mutation>
        )        
    }

}

export default DeletePost