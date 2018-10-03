import { title } from "../../../material-kit-react.jsx";
import imagesStyle from "../../imagesStyles.jsx";

const contentStyle = {
  section: {
    padding: "70px 0",
    textAlign: "left"
  },
  title: {
    ...title,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  ...imagesStyle,

  description: {
    color: "black"
  },
  listItem: {
    marginTop: "30px",
  },
};

export default contentStyle;
