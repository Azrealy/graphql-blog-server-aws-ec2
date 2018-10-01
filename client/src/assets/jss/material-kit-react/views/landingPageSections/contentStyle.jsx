import { title } from "../../../material-kit-react.jsx";
import imagesStyle from "../../imagesStyles.jsx";

const contentStyle = {
  section: {
    display: "inline-block",
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
  code: {
    padding: "2px 2px",
    margin: "0 2px",
    fontSize: "100%",
    color: "#06b6ef",
    background: "#2f1e2e",
    borderRadius: "4px",
  },
  description: {
    color: "black"
  },
  listItem: {
    marginTop: "30px",
  },
};

export default contentStyle;
