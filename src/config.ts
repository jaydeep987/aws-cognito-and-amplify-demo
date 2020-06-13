import { Amplify, Auth } from 'aws-amplify';

export const appConfig = {
  region: 'us-west-2',
  IdentityPoolId: '',
  UserPoolId: 'us-west-2_XDbJlu5X5',
  ClientId: '6md9irh0e2berrv99okfimmfu5',
}

const oauth = {
  domain: 'bharatkakisanpgc.auth.us-west-2.amazoncognito.com',
  scope: ['phone', 'email', 'profile', 'openid' ],
  redirectSignIn: 'http://localhost:3000/',
  redirectSignOut: 'http://localhost:3000/',
  responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
};

export const config = {
  identityPoolId: '',
  userPoolId: appConfig.UserPoolId,
  region: appConfig.region,
  userPoolWebClientId: appConfig.ClientId,
  oauth,
};

Auth.configure(config)

Amplify.configure({
  Auth: config
});
