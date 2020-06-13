import * as AWS from "aws-sdk/global";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken
} from "amazon-cognito-identity-js";
import React from "react";
import "./config";
import Amplify, { Auth, Hub } from 'aws-amplify';

import { Signup } from './components/signup';
import { Box } from "@material-ui/core";
import { Verify } from './components/verify';
import { ContactInfo } from "./components/contact-info";
import { Home } from "./components/home";

// const userPool = new CognitoUserPool({
//   UserPoolId: appConfig.UserPoolId,
//   ClientId: appConfig.ClientId,
// });

export enum Steps {
  SIGNUP = 'step-1',
  VERIFY = 'step-2',
  REGISTER = 'step-3',
  HOME = 'step-4'
}

interface State {
  step: Steps;
}

export class App extends React.Component<{}, State> {
  cognitoUser;

  constructor(props) {
    super(props);
    this.state = {
      step: Steps.SIGNUP,
    };
  }

  updateStep = (step: Steps) => {
    this.setState({
      step,
    });
  }

  render() {
    return (
      <Box display="flex" bgcolor="#dcedc8">
        <Box width={500} justifyContent="center" m="auto" alignItems="center">
          {this.state.step === 'step-1' && <Signup updateStep={this.updateStep} />}
          {this.state.step === 'step-2' && <Verify updateStep={this.updateStep} />}
          {this.state.step === 'step-3' && <ContactInfo updateStep={this.updateStep} />}
          {this.state.step === 'step-4' && <Home updateStep={this.updateStep} />}
        </Box>
      </Box>
    )
  }
}
