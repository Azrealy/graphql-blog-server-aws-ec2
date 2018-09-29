import React from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TAG = gql`
  mutation ($name: String!) {
    addTag(name: $name) {
      id
      name
    }
  }
`

class AddTag extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  onChange = event => {
    const value = event.target.value
    this.setState({ name: value })
  }

  onSubmit = (event, addTag) => {
    addTag().then(async ({data}) => {
      this.setState({ name: '' })
      await this.props.refetch()
      console.log(data.addTag.name)
    })
    event.preventDefault()
  }

  render() {
    const { name } = this.state
    console.log(name)
    return (
      <Mutation
        mutation={ADD_TAG}
        variables={{ name: name }}
        update={this.addTagUpdate}
        >
        {(addTag, {data, loading, error}) => (
          <div>

          <input
            value={name}
            onChange={this.onChange}
            type="text"
            />
            <button onClick={event => this.onSubmit(event, addTag)}>
              add
            </button>
          </div>
        )}
      </Mutation>
    )
  }
}

export default AddTag