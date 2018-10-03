import React from 'react';
import { Link } from 'react-router-dom'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CreateIcon from "@material-ui/icons/Create";
import DeletePost from "../../DeletePost";
import Paper from '@material-ui/core/Paper';
import ContentManagerPage from "../../ContentManager";
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import './style.css';


const toIdHash = string => Buffer.from(string).toString('base64');

class PostRow extends React.Component {
  anchorEl = null
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render() {
    const { 
      id, 
      title, 
      image,
      createdAt, 
      tags } = this.props.post
    const data = new Date(Number(createdAt))
    return (
      <TableRow hover key={id}>
        <TableCell>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            variant="contained"
            onClick={this.handleOpen}
          >
            <CreateIcon />
          </Button>
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
                boundariesElement: 'window',
              },
            }}
          >
            <Paper>
              <ContentManagerPage
                post={this.props.post}
                isUpdate={true}
                handleClose={this.handleClose}/>
            </Paper>
          </Popper>
            <DeletePost id={id} />
        </TableCell>
        <TableCell>
          {id}
        </TableCell>
        <TableCell>
          <Link to={`/posts/${toIdHash(id)}`}>{title}</Link>
        </TableCell>
        <TableCell><img src={image} alt="..." height="80" width="90" /></TableCell>
        <TableCell>{tags.map(({ id, name }) => (<p key={id}> {name} </p>))}</TableCell>
        <TableCell>{data.toDateString()}</TableCell>
    
      </TableRow>      
    )
  }

}

export default PostRow