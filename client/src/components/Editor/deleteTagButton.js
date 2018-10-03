import React from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const DELETE_TAG = gql`
  mutation ($id: ID!) {
    deleteTag(id: $id)
  }
`

class DeleteTag extends React.Component {

  onClick = (event, deleteTag) => {
    deleteTag().then(async ({ data }) => {
    })
    event.preventDefault()
  }

  deleteTagUpdate = (client) => {
    const query = gql`
        query TagQuery {
          tags {
            id
            name
            __typename
          }
      }
    `
    const { tags } = client.readQuery({ query })

    client.writeQuery({
      query,
      data: {
        tags: tags.filter(tag => tag.id !== this.props.id)
      },
    })
  }

  render() {
    const { id } = this.props

    return (
      <Mutation
        mutation={DELETE_TAG}
        variables={{ id: id }}
        update={this.deleteTagUpdate}
      >
        {(deleteTag, { data, loading, error }) => (
          <div>

            <button onClick={event => this.onClick(event, deleteTag)}>
              delete
            </button>
          </div>
        )}
      </Mutation>
    )
  }
}

export default DeleteTag