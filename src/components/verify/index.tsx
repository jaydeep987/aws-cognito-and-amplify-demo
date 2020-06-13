
import React from 'react';
import { observer, inject } from 'mobx-react';
import SignupStore from '../../stores/signup';
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
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Steps } from '../../App';

interface Props {
  updateStep: (step: Steps) => void;
}

interface StoreProps {
  /** Admin review store */
  signupStore: SignupStore;
}

type InjectedProps = Props & StoreProps;

@inject('signupStore')
@observer
export class Verify extends React.Component<Props> {
  get injectedProps(): InjectedProps {
    return this.props as InjectedProps;
  }

  verify = async () => {
    const { signupStore } = this.injectedProps;
    // this.props.updateStep('step-3');

    // first try to authenticate
    const authenticatedUser = await this.authenticate();

    // if authenticated, it means log in and move to home
    if (authenticatedUser) {
      return;
    }

    // if not logged in then signup and get token
    await this.signup();
  }

  async authenticate() {
    const { signupStore } = this.injectedProps;

    try {
      const user = await Auth.signIn(signupStore.mobile, signupStore.mobile);

      if (!user) {
        return false;
      }

      signupStore.authenticated = true;
      signupStore.token = user.getSignInUserSession().getIdToken().getJwtToken();
      // goto Home
      this.props.updateStep(Steps.HOME);

      return user;
    } catch(e) {
      // console.error(e);
      console.log(e);
      if (e && e.code === 'NotAuthorizedException')
        return false;
      throw e;
    }
  }

  async signup() {
    const { signupStore } = this.injectedProps;
    const username = signupStore.mobile;
    const password = signupStore.mobile;

    try {
      await Auth.signUp({
        username,
        password,
      });

      // After successful signup, now authenticate user to get token
      await this.authenticate();

      // And then goto contact details form
      this.props.updateStep(Steps.REGISTER);
    } catch(error) {
      console.error('error when signup');
    }
  }

  render() {
    return (
      <Paper style={{ width: 500, padding: 5 }}>
        <Grid container={true} spacing={3} alignItems="center" alignContent="center" justify="center">
          <Grid item xs={12}>
            <Typography variant="h2">
              Verify
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h3">
              Enter OTP
            </Typography>
          </Grid>
          <Grid container spacing={3} alignItems="center" alignContent="center" justify="center">
            <Grid item xs={6}>
              <TextField fullWidth={true} label="OTP" variant="outlined" value={this.injectedProps.signupStore.otp} onChange={(e) => this.injectedProps.signupStore.otp = e.target.value } />
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" alignContent="center" justify="center">
            <Grid item xs={3}>
              <Button color="primary" variant="outlined" onClick={this.verify}> Submit </Button>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Paper>
    );
  }
}
