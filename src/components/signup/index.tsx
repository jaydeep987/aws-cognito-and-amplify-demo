
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
import { observer, inject } from 'mobx-react';
import SignupStore from '../../stores/signup';
import { Auth, Hub } from 'aws-amplify';
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
export class Signup extends React.Component<Props> {

  componentDidMount() {
    Auth.currentAuthenticatedUser().then((user) => {
      const { signupStore } = this.injectedProps;

      console.log('user', user);
      signupStore.authenticated = true;
      signupStore.token = user.getSignInUserSession().getIdToken().getJwtToken();

      // Call BKK API with Token, if this fbuser is alredy registered
      const bkkApiResponse = false;

      // if yes, goto home
      if (bkkApiResponse) {
        this.props.updateStep(Steps.HOME);
        return;
      }

      // otherwise goto contact info screen to register new user
      this.props.updateStep(Steps.REGISTER);
    });
  }

  get injectedProps(): InjectedProps {
    return this.props as InjectedProps;
  }

  signup = () => {
    // Goto verify
    this.props.updateStep(Steps.VERIFY);
  }

  fbSignIn = () => {
    // In case of fb/google signup/signin, there will be common step in both case (signup and signin)
    // If user is not already signed up, it will sign up and auto sign in and provides token
    // if user is already signed up, it will sign in and provides token
    // in any case, after successful operation, get token
    // then call BKK API To check whether user already registerd or not, if yes -> move to home
    // if no -> move to contact info
    Auth.federatedSignIn({ provider: 'Facebook' } as any);
  }

  render() {
    return (
      <Paper style={{ width: 500, padding: 5 }}>
        <Grid container={true} spacing={3} alignItems="center" alignContent="center" justify="center">
          <Grid item xs={12}>
            <Typography variant="h2">
              Signup
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth={true} label="Mobile number" variant="outlined" value={this.injectedProps.signupStore.mobile} onChange={(e) => this.injectedProps.signupStore.mobile = e.target.value } />
          </Grid>
          <Grid container spacing={3} alignItems="center" alignContent="center" justify="center">
            <Grid item xs={3}>
              <Button color="primary" variant="outlined" onClick={this.signup}> Proceed </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader subheader="or signup using">
              </CardHeader>
              <CardContent>
                <ButtonGroup>
                  <Button color="primary" onClick={this.fbSignIn}>
                    Facebook
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
