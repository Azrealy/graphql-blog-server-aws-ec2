import React, { Fragment } from "react";
import { Mutation } from 'react-apollo';
import gql from "graphql-tag";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import POST_FRAGMENT from "../../constants/fragments";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import withAuthorization from "../Session/withAuthorization";

const DELETE_POST = gql`
    mutation($id: ID!) {
        deletePost(id: $id)
    }
`

class DeletePost extends React.Component {
    anchorEl = null

    state = {
        open: false,
    };

    onClick = (event, deletePost) => {
        deletePost().then(async ({data}) => {
            
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

    handleOpen = () => {
        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <Mutation
                mutation={DELETE_POST}
                variables={{id: this.props.id}}
                update={this.deletePostUpdate}
                >
                {(deletePost, { data, loading, error }) => (
                    <Fragment>
                    <Button variant= "contained"
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        variant="contained"
                        onClick={this.handleOpen}
                    ><DeleteRoundedIcon/></Button>
                    <Popper
                        placement="right-end"
                        disablePortal={false}
                        open={this.state.open}
                        anchorEl={this.anchorEl}
                        modifiers={{
                            flip: {
                                enabled: true,
                            },
                            preventOverflow: {
                                enabled: true,
                                boundariesElement: 'viewport',
                            },
                        }}
                    >
                        <Paper>
                            <h3>Do you sure, you want delete this post?</h3>
                                <Button 
                                onClick={(event) => this.onClick(event, deletePost)}>
                                Sure, I want delete it</Button>
                                <Button
                                    onClick={this.handleClose}>
                                Cancel
                                </Button>
                        </Paper>
                    </Popper>
                    </Fragment>
                )}
            </Mutation>
        )        
    }

}

export default withAuthorization(
    session => session && session.me && session.me.role === 'ADMIN',
)(DeletePost)