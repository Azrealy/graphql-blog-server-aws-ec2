import * as React from "react";
import ReactMde, { DraftUtil } from "react-mde";
import * as Showdown from "showdown";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


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

export class ReactMdeDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mdeState: null,
      store: []
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
  }

  handleValueChange = (mdeState) => {
    this.setState({ mdeState });
  };

  handleTagChange = event => {
    if (event.target.checked) {
      this.setState({ store: [...this.state.store, event.target.value]})
    } else {
      this.setState({ store: this.state.store.filter(value => value !== event.target.value)})
    }
  };

  generateMarkdownPreview = (markdown) => {
    return this.converter.makeHtml(markdown);
  };

  onButtonClick = async () => {
    const { mdeState } = this.state;
    const newMdeState = await DraftUtil.buildNewMdeState(
      mdeState,
      this.generateMarkdownPreview,
      mdeState.markdown + " " + mdeState.markdown
    );
    this.setState({ mdeState: newMdeState });
  };

  render() {
    const { classes } = this.props

    return (
      
      <div>
        <form onSubmit={this.onSubmit} >
        <div className={classes.container}>
        <TextField
          id="filled-name"
          label="Title"
          className={classes.textField}
          value={""}
          fullWidth
          margin="normal"
          variant="filled"
        />
        <TextField
          id="filled-name"
          label="Description"
          className={classes.textField}
          value={""}
          fullWidth
          margin="normal"
          variant="filled"
        />
        </div>
        <h3>Tags</h3>
        {this.props.tags.map((tag) => (
          <div key={tag.id}>
          <FormControlLabel
            control={
              <Checkbox
                value={tag.text}
                onChange={(e) => this.handleTagChange(e)}
                color="primary"
              />
            }
              label={tag.text}
            />
          </div>
        ))}
        <h3>Text</h3>
        <ReactMde
          layout="horizontal"
          onChange={this.handleValueChange}
          editorState={this.state.mdeState}
          generateMarkdownPreview={this.generateMarkdownPreview}
        />
        <button style={{ marginTop: 20 }}>
          Submit
        </button>
      </form>
      </div>
    );
  }
}

export default  withStyles(styles)(ReactMdeDemo)