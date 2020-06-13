
import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Grid,
  CardHeader
} from '@material-ui/core';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken
} from "amazon-cognito-identity-js";
import axios from 'axios';

import { config } from '../../config';

import { observer, inject } from 'mobx-react';
import SignupStore from '../../stores/signup';
import { Auth } from 'aws-amplify';
import { Steps } from '../../App';

interface Props {
  updateStep: (step: Steps) => void
}

interface StoreProps {
  /** Admin review store */
  signupStore: SignupStore;
}

type InjectedProps = Props & StoreProps;

@inject('signupStore')
@observer
export class Home extends React.Component<Props> {
  get injectedProps(): InjectedProps {
    return this.props as InjectedProps;
  }

  signOut = async () => {
    const { signupStore } = this.injectedProps;

    await Auth.signOut();
    signupStore.authenticated = false;
    signupStore.token = '';
    signupStore.refreshToken = '';
    window.location.href = '/';
  }

  async componentDidMount() {
    const { signupStore } = this.injectedProps;

    if (!signupStore.authenticated) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      return;
    }

    const isExpired = await this.checkTokenExpiredOrRefresh();

    if (!isExpired) {
      this.fetchTrendingCrops();
    }
  }

  async checkTokenExpiredOrRefresh() {
    const { signupStore } = this.injectedProps;
    const session = await Auth.currentSession();
    const token = atob(signupStore.token.split('.')[1]);
    const tokenObj = JSON.parse(token);
    const currentTime = Math.trunc(new Date().getTime() / 1000) + (5 *60); // Adding 5 min extra, so we can refresh 5 min earlier

    if (currentTime < tokenObj.exp) {
      return false;
    }

    console.log('token expired');

    const poolData = {
      UserPoolId: config.userPoolId,
      ClientId: config.userPoolWebClientId,
    };

    return new Promise((resolve, reject) => {
      const userPool = new CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        const refreshToken = session.getRefreshToken();
        cognitoUser.refreshSession(refreshToken, (err, refSession) => {
          if (err) {
            console.error(err);
            reject(err);
            return false;
          }

          console.log(refSession);
          // Got new tokens, so store it
          signupStore.token = refSession.getIdToken().getJwtToken();
          resolve(true);
        });
      }
      reject();
    });
  }

  async fetchTrendingCrops() {
    const url = 'https://api.pledgesoft.com/pyapi/trends/crops/filter/?state=gujarat';
    const data = await axios.get(url);
    console.log(data);
  }

  render() {
    const { signupStore } = this.injectedProps;

    if (!signupStore.authenticated) {
      return null;
    }

    return (
      <Paper style={{ width: 500, padding: 5 }}>
        <Grid container={true} spacing={3} alignItems="center" alignContent="center" justify="center">
          <Grid item xs={10}>
            <Typography variant="h3">
              Welcome to home!!
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" color="secondary" onClick={this.signOut}>Logout</Button>
          </Grid>
          <Grid item xs={12}>
            {signupStore.token}
          </Grid>
        </Grid>
        <br />
      </Paper>
    );
  }
}
