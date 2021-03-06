import { Component } from "react";
import Input from "../components/Input";
import axios from "axios";
// import{withTranslation} from "react-i18next";
// import "./locale/i18n";

class SignUpPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const errorsCopy = {...this.state.errors};
    delete errorsCopy[id];
    this.setState({
      [id]: value,
      errors: errorsCopy
    });
  };

  submit = async (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    try {
      await axios.post("/api/1.0/users", body);
      this.setState({ signUpSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
        this.setState({ apiProgress: false });
      }
    }
  };
  
  
  render() {

    // const{t} = this.props;
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    let passwordMismatch = "";

    if(password !== passwordRepeat){
      passwordMismatch = "Password mismatch";
    }
    return (
      <div data-testid="signup-page" className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form
            data-testid="form-sign-up"
            className="card mt-5"
            data-tesid="form-sign-up"
          >
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>
            <div className="card-body">
              <Input
                id="username"
                label="User name"
                onChange={this.onChange}
                help={errors.username}
              />

              <Input
                id="email"
                label="Email"
                onChange={this.onChange}
                help={errors.email}
              />
              <Input
                id="password"
                label="Password"
                onChange={this.onChange}
                help={errors.password}
                type="password"
              />
              <Input
                id="passwordRepeat"
                label="Password repeat"
                onChange={this.onChange}
                help={passwordMismatch}
                type="password"
              />
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                >
                  {apiProgress && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Sign up
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="alert alert-success mt-3" role="alert">
            Please check you email to activate your account
          </div>
        )}
      </div>
    );
  }
}
// const SignUpPageWithTranslation = withTranslation()(SignUpPage);
export default SignUpPage;
