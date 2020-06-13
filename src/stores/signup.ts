import { types } from 'mobx-state-tree';
import { observable } from 'mobx';

class SignupStore {
  @observable mobile = '9876541230';
  @observable otp = '12345';
  @observable authenticated = false;
  @observable fbRefId = '';
  @observable token = '';
  @observable refreshToken = '';
}

  export default SignupStore;
