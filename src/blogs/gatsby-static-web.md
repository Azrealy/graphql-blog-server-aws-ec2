---
title: Gatsby a static Progressive Web Apps Generator
description: This folder is created by the command `gatsby new <project name>`, and installed a couple more dependencies like `gatsby-source-filesystem` and `gatsby-transformer-remark`. Here `gatsby-source-filesystem` create **File** nodes from the file system, whereas `gatsby-transformer-remark` will transform any `Markdown(.md)` files into **MarkdownRemark** nodes, making it easier to query them with `GraphQL`.
tags: Gatsby, English
image: https://cdn.stocksnap.io/img-thumbs/960w/GSCBZ4JH7S.jpg
---
# Gatsby a static Progressive Web Apps Generator

This folder is created by the command `gatsby new <project name>`, and installed a couple more dependencies like `gatsby-source-filesystem` and `gatsby-transformer-remark`. Here `gatsby-source-filesystem` create **File** nodes from the file system, whereas `gatsby-transformer-remark` will transform any `Markdown(.md)` files into **MarkdownRemark** nodes, making it easier to query them with `GraphQL`.

`gatsby-config.js` file is a webpack configure liking file.

# Setup your site

## Create you first posts
Go to `src/pages` folder and create a directory name as `My Blogs #1` to store you `markdown` files. And create a `webpack.md` write like:
```bash
---
path: '/webpack-tutorial'
date: '2018-05-23T12:34:00+00:00'
title: "Webpack 4 tutorial"
tags: ['webpack', 'full-stock']
excerpt: "Webpack 4 has a massive performance improvement as zero configure module bundler. This tutorial is a hands on session for configure a webpack to you project."
---
(Start writing your blog post from here)
```
Here `path` is the URL to access this post. `date` using **Unix TimeStamp**, `title` for the blog post, `tag` is a list of key words be able to search for the post, `excerpt` is a small summary that it will show on the main Blog's page.

## Create an index of your posts

Go to `src/pages/index.js` write the following code:
```js
import React from 'react';
import Link from 'gatsby-link';

const IndexPage = ({data}) => {
  const {edges: posts} = data.allMarkdownRemark;
  return (
    <div>
      {posts.map (({node: post}) => {
        const {frontmatter} = post;
        return (
          <div>
            <h2>
              <Link to={frontmatter.path}>
                {frontmatter.title}
              </Link>
            </h2>
            <p>{frontmatter.date}</p>
            <p>{frontmatter.excerpt}</p>
          </div>
        );
      })}
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            excerpt
          }
        }
      }
    }
  }
`;

export default IndexPage;
```
Here is take a look of the GraphQL query, which is going to take in all the Markdown files inside the `src` folder. It will then give out the total number of markdown files (totalCount) and set up `edges` containing `node`. The `edge` is a file system path to the `node`.Here `node` is nothing but our `blog` post. Finally this data is then taken into the `indexpage` component.

Then you can run the command of `npm run develop` to start the web site.

# Building a Template for the Blog Post

Pass the blog post's data into a template component for rendering the blogs. At `src` directory, create a new folder called `templates`. Create a template component inside this folder and name the file as `blog-post.js` and write this code inside it.
```js
import React from 'react';
import Helmet from 'react-helmet';

const Template = ({data, location}) => {
  const {markdownRemark: post} = data
  const {frontmatter, html } = post

  return (
    <div>
      <Helmet title={frontmatter.title + ' Blog'} />
      <div>
        <h1>{frontmatter.title}</h1>
        <h3>{frontmatter.date}</h3>
        <div dangerouslySetInnerHTML={{__html: html}}/>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM, DD, YYYY")
        path
        tags
        excerpt
      }
    }
  }
`

export default Template;
```
`react-helmet` is a React component that can be used to manage any changes to the document head.
[Helmet](https://github.com/nfl/react-helmet) takes plain HTML tags and outputs plain HTML tags. Here we use it to get a dynamic title of the blog post.

Here I use the [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html) React's API which is a replacement for React's `innerHTML` API, for render the HTML that is be ing created by Gatsby from the markdown file.

Create a new GraphQL query to get the `html` and `frontmatter` data to the `Template` component.


# Generate Blog Posts

Use `createPages` Gatsby API to build our pages. At the `gatsby-node.js` which is defined as a contents server fetching the `markdown` file data for `template` component.

```js
const path = require('path')

exports.createPages = ({boundActionCreators, graphql}) => {
  const {createPage} = boundActionCreators;
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  return graphql (
    `{
    allMarkdownRemark {
      edges {
        node {
          html
          id
          frontmatter {
            date
            path
            title
            excerpt
            tags
          }
        }
      }
    }
  }`
  ).then (result => {
    if (result.errors) {
      return Promise.reject (result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach (({node}, index) => {
      createPage ({
        path: node.frontmatter.path,
        component: blogPostTemplate,
      });
    });
  });
};
```
Then run the command `gatsby develop` start the server. You will found you posts render successfully.

# Links to Next and Pervious

[createPage](https://www.gatsbyjs.org/docs/node-apis/) API will allows to pass any additional data through `context`.

Add two keys `prev` and `next` to the `context` of createPage for rendering forward and back potions.

```js
posts.forEach (({node}, index) => {
  createPage ({
    path: node.frontmatter.path,
    component: blogPostTemplate,
    context: {
      prev: index === 0 ? null : posts[index - 1].node,
      next: index === posts.length - 1 ? null : posts[index + 1].node,
    },
  });
});
```
Then go to the `templates/post-blog.js` to make a few updates for the `Template` component. First add a new key `pathContext` to the component parameters, which is referred to the key `context` we just added in the `createPage` API.
```js
const Template = ({data, location, pathContext}) => {
  const {markdownRemark: post} = data;
  const {frontmatter, html} = post;
  const {title, date} = frontmatter;
  const {next, prev} = pathContext;
  ...
```
Add the `next` and `prev` links right below the `div` with the `dangerouslySetInnerHTML` API.
```js
<p>
    {prev &&
    <Link to={prev.frontmatter.path}>
        Previous: {prev.frontmatter.title}
    </Link>
    }
</p>
<p>
    {next &&
    <Link to={next.frontmatter.path}>
        Next: {next.frontmatter.title}
    </Link>}
</p>
```
then that `prev` and `next` link will show in the every blogs.

# Render Tags

We use tags to group the blog posts. Create two new files inside `templates` folder for handling `tags` classification. Named as `tags.js` and `all-tags.js`.

Write the following code inside `all-tags.js` file.
```js
import React from 'react';
import Link from 'gatsby-link';

const AllTags = ({pathContext}) => {
  const {tags} = pathContext;

  if (tags) {
    return (
      <div>
        <ul>
          {tags.map (tag => {
            return (
              <li>
                <Link to={`tags/${tag}`}>
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};
```
Get `tags` props from the `pathContent` and then map over the tags to create a bullet list. Each item in the list is a link to the tag. Then `tags.js` file will be similar to this.
```js
import React from 'react';
import Link from 'gatsby-link';

const Tags = ({pathContext}) => {
  const {posts, tagName} = pathContext;

  if (posts) {
    return (
      <div>
        <span>
          Posts about {tagName};
        </span>

        <ul>
          {posts.map (post => {
            return (
              <li>
                <Link to={post.frontmatter.path}>
                  {post.frontmatter.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};

export default Tags;
```
Here, we get the `posts` and `tagName` from the `pathContext`. Now, if there any posts related to a particular tag, we list them out in an unordered list.

Now we created the two new `templates` components for the `tags`. Next we should make some updates to `gatsby-node.js` add a function called `createdTagPages`.

```js
const createTagPages = (createPage, posts) => {
  const tagPageTemplate = path.resolve (`src/templates/tags.js`);
  const allTagsTemplate = path.resolve (`src/templates/all-tags.js`);

  const postsByTags = {};

  posts.forEach (({node}) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach (tag => {
        if (!postsByTags[tag]) {
          postsByTags[tag] = [];
        }
        postsByTags[tag].push (node);
      });
    }
  });
  const tags = Object.keys (postsByTags);

  createPage ({
    path: `/tags`,
    component: allTagsTemplate,
    context: {
      tags: tags.sort (),
    },
  });
  tags.forEach (tagName => {
    const posts = postsByTags[tagName];

    createPage ({
      path: `/tags/${tagName}`,
      component: tagPageTemplate,
      context: {
        posts,
        tagName,
      },
    });
  });
};
```
Generate a Object named as `postsByTags`, where store the `tag` as a key and a list of `node` which is referred to the `tag` as a the value. Then use this Object to called the  CreatePage API for generate the page.

Finally at the `pages/index.js` to render those `tags` link.
```js
<ul>
  {post.frontmatter.tags.map (tag => {
    return (
      <li>
        <Link to={`/tags/${tag}`}>
          {tag}
        </Link>
      </li>
    );
  })}
</ul>
```
Congrats, your first content blogs are created successful.