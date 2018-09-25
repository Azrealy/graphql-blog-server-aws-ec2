import * as React from "react";
import ReactMde, { ReactMdeTypes, DraftUtil } from "react-mde";
import * as Showdown from "showdown";

export interface ReactMdeDemoProps {}

export interface ReactMdeDemoState {
  mdeState: ReactMdeTypes.MdeState;
}

export class ReactMdeDemo extends React.Component<
  ReactMdeDemoProps,
  ReactMdeDemoState
> {
  converter: Showdown.Converter;

  constructor(props) {
    super(props);
    this.state = {
      mdeState: null
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
  }

  handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
    this.setState({ mdeState });
  };

  generateMarkdownPreview = (markdown: string) => {
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
    return (
      <div>
        <ReactMde
          onChange={this.handleValueChange}
          editorState={this.state.mdeState}
          generateMarkdownPreview={this.generateMarkdownPreview}
        />
        <button style={{ marginTop: 20 }} onClick={this.onButtonClick}>
          Duplicate text
        </button>
      </div>
    );
  }
}
