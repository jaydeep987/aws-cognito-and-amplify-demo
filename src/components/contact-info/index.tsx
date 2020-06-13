
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
import Amplify, { Auth, Hub } from 'aws-amplify';
import { observer, inject } from 'mobx-react';
import SignupStore from '../../stores/signup';
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
export class ContactInfo extends React.Component<Props> {
  get injectedProps(): InjectedProps {
    return this.props as InjectedProps;
  }

  register = () => {
    // CALL BKK API To Register User
    // Pass token retrieved from authentication
    const { signupStore } = this.injectedProps;
    const token = signupStore.token;
    this.props.updateStep(Steps.HOME);
  }

  render() {
    const { signupStore } = this.injectedProps;

    if (!signupStore.authenticated) {
      return (
        <Paper style={{ width: 500, padding: 5 }}>
          <Typography variant="h2">
              You are not authorized to view this page
            </Typography>
        </Paper>
      )
    }

    return (
      <Paper style={{ width: 500, padding: 5 }}>
        <Grid container={true} spacing={3} alignItems="center" alignContent="center" justify="center">
          <Grid item xs={12}>
            <Typography variant="h2">
              Contact info
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {signupStore.token}
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth={true} label="First name" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth={true} label="Last name" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth={true} label="Email" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth={true} label="Mobile" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth={true} label="Postcode" variant="outlined" />
          </Grid>
          <Grid container spacing={3} alignItems="center" alignContent="center" justify="center">
            <Grid item xs={3}>
              <Button color="primary" variant="outlined" onClick={this.register}> Submit </Button>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Paper>
    );
  }
}
