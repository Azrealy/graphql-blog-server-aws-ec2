import { cardTitle, title } from "../../../material-kit-react.jsx";
import imagesStyle from "../../imagesStyles.jsx";

const teamStyle = {
  section: {
    padding: "60px 0",
    textAlign: "left"
  },
  link: {
    "&": {
      color: "#3C4858",
      fontFamily: `"Roboto Slab", "Times New Roman", serif`,
      textDecoration: "none"
    },
    "&:hover": {
      color: "green",
      textDecoration: "underline",
      display: "block",
    }
  },
  title: {
    ...title,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  ...imagesStyle,
  itemGrid: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  cardTitle,
  smallTitle: {
    marginTop: "10px",
    marginBottom: "10px",
    color: "#6c757d"
  },
  description: {
    marginTop: "10px",
    marginBottom: "10px",
    color: "#999"
  },
  justifyCenter: {
    justifyContent: "center !important"
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  margin5: {
    margin: "5px"
  }
};

export default teamStyle;
