`mutation($tittle: String!, $description: String!, $text: String!, $tags: [String!]!){
    createPost(title: $tittle, description: $description, text: $text, tags: $tags){
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

variable = {
    "tittle": "hello world",
    "description": "this is the description",
    "text": "this is the text of this post",
    "tags": ["javascript", "react"]
  }