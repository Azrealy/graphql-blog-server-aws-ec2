import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import IconButton from '@material-ui/core/IconButton';
import People from "@material-ui/icons/People";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Warning from "@material-ui/icons/Warning";
// core components
import Header from "../../material-components/Header/Header.jsx";
import HeaderLinks from "../../material-components/Header/HeaderLinks.jsx";
import Footer from "../../material-components/Footer/Footer.jsx";
import GridContainer from "../../material-components/Grid/GridContainer.jsx";
import GridItem from "../../material-components/Grid/GridItem.jsx";
import Button from "../../material-components/CustomButtons/Button.jsx";
import Card from "../../material-components/Card/Card.jsx";
import CardBody from "../../material-components/Card/CardBody.jsx";
import CardHeader from "../../material-components/Card/CardHeader.jsx";
import CardFooter from "../../material-components/Card/CardFooter.jsx";
import CustomInput from "../../material-components/CustomInput/CustomInput.jsx";
import SnackbarContent from "../../material-components/Snackbar/SnackbarContent.jsx";

import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage";

import image from "../../assets/img/landing-bg.jpg";

import * as routes from "../../constants/routes";
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../components/Error';

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;


class LoginPage extends React.Component {
    state = {
        cardAnimaton: "cardHidden",
        login: '',
        password: '',
        showPassword: false,
        };

    handleClickShowPassword = () => {
        this.setState({showPassword: !this.state.showPassword});
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };
    onSubmit = (event, signIn) => {
        signIn().then(async ({ data, error }) => {
            this.setState({login: '', password: '' });
            localStorage.setItem('token', data.signIn.token);
            if (error) {
              return
            }
            await this.props.refetch();

            this.props.history.push(routes.POSTS);
        })
        event.preventDefault();
    }
    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
  render() {
    console.log("state of login", this.state);
    const { login, password } = this.state;
    const isInvalid = password === '' || login === '';
    const { classes, ...rest } = this.props;
    return (
    <Mutation mutation={SIGN_IN} variables={{ login, password }}>
    {(signIn, {data, loading, error}) => (
        <div>
        <Header
          absolute
          color="transparent"
          brand="George Blog"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                <form autoComplete="new-password" 
                    className={classes.form}
                    onSubmit={event => this.onSubmit(event, signIn)}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h3>Login</h3>
                    </CardHeader>
                    <p className={classes.divider}> </p>
                    <CardBody>
                      <CustomInput
                        id="first"
                        labelText="User Name..."
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          value: login,
                          onChange: this.handleChange("login"),
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        id="pass"
                        labelText="Password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          autoComplete: "off",
                          value: password,
                          onChange: this.handleChange("password"),
                          type: this.state.showPassword ? 'text' : 'password',
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowPassword}
                                className={classes.inputIconsColor}>
                                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                    <Button 
                        disabled={isInvalid || loading}
                        color="primary"
                        type="submit">
                        Submit
                      </Button>
                    </CardFooter>
                    {error && <SnackbarContent
                      message={
                        <span>
                          <b>WARNING ALERT:</b> Login Failed !
                        </span>}
                      close
                      color="warning"
                      icon={Warning} />}
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div>)}
    </Mutation>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
