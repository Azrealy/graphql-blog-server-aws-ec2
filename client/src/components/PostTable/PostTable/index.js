import React from 'react'
import PostRow from "../PostRow";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Link } from 'react-router-dom';
import ErrorMessage from '../../Error';
import * as routes from '../../../constants/routes';

class PostTable extends React.Component {

  renderTableRow = () => {
    const { data, error } = this.props
    if (error) {
      return <TableRow><ErrorMessage error={error} /></TableRow>
    } 

    if (data && data.posts.edges.length !== 0) {
      return data.posts.edges.map((post) => (
        <PostRow post={post} key={post.id} />
      ))
    } else {
      return <TableRow> No Post </TableRow>
    }
  }

  render() {
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Link to={routes.EDITOR_MANAGER}>New Post</Link>
              </TableCell>
              <TableCell>
                ID
              </TableCell>
              <TableCell>
                Title 
              </TableCell>
              <TableCell>
                Image 
              </TableCell>
              <TableCell>
                Tags
              </TableCell>
              <TableCell>
                Created at
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderTableRow()}
          </TableBody>

        </Table>
      </Paper>
    )
  }
}

export default PostTable;