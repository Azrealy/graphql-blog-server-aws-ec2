import React from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TAG = gql`
  mutation AddTag($name: String!) {
    addTag(name: $name) {
      id
      name
    }
  }
`

class AddTag extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const name = "hello";
    return (
      <Mutation
        mutation={ADD_TAG}
        variables={{name}}
        >
        {(AddTag, {data, loading, error}) => (
          <div>
          <input />
          <button>
            add
          </button>
          </div>
        )}
      </Mutation>
    )
  }
}

export default AddTag