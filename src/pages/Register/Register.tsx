import React, { useReducer, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerReducer } from './Register.reducer';
import { handleRegisterAction } from './Register.actions';
import { googleLogin } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

declare global {
  interface Window {
    google: any;
    _gsi_client?: any;
    _gsi_initialized?: boolean;
  }
}

const PASSWORD_RULES = [
  { key: 'length',    label: 'At least 8 characters',         test: (p: string) => p.length >= 8 },
  { key: 'upper',     label: 'One uppercase letter (A–Z)',     test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower',     label: 'One lowercase letter (a–z)',     test: (p: string) => /[a-z]/.test(p) },
  { key: 'digit',     label: 'One digit (0–9)',                test: (p: string) => /[0-9]/.test(p) },
  { key: 'special',   label: 'One special character (!@#$%…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function isPasswordStrong(password: string) {
  return PASSWORD_RULES.every(r => r.test(password));
}

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [state, dispatch] = useReducer(registerReducer, { firstName: '', lastName: '', email: '', password: '', error: '' });
  const [passwordTouched, setPasswordTouched] = React.useState(false);

  useEffect(() => {
    if (window.google && !window._gsi_client) {
      window._gsi_client = window.google.accounts.oauth2.initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: handleCredentialResponse
      });
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    if (response.code) {
      try {
        const user = await googleLogin(response.code);
        setUser(user);
        navigate('/feed');
      } catch (err: any) {
        dispatch({ type: 'SET_FIELD', field: 'error', value: err.response?.data || 'Google Registration failed' });
      }
    }
  };

  const handleGoogleClick = () => {
    if (window._gsi_client) {
      window._gsi_client.requestCode();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    if (!isPasswordStrong(state.password)) return;
    await handleRegisterAction(state, dispatch, navigate);
  };

  const showRules = passwordTouched || state.password.length > 0;

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b20">
                  <img src="/assets/images/logo.svg" alt="Image" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b30">Registration</h4>
                {state.error && <div className="alert alert-danger">{state.error}</div>}

                <button
                  type="button"
                  className="_social_registration_content_btn _mar_b30"
                  onClick={handleGoogleClick}
                >
                  <img src="/assets/images/google.svg" alt="Image" className="_google_img" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b30">
                  <span>Or</span>
                </div>

                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          value={state.firstName}
                          onChange={e => dispatch({ type: 'SET_FIELD', field: 'firstName', value: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          value={state.lastName}
                          onChange={e => dispatch({ type: 'SET_FIELD', field: 'lastName', value: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          className="form-control _social_registration_input"
                          value={state.email}
                          onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b8">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          className={`form-control _social_registration_input${showRules && !isPasswordStrong(state.password) ? ' is-invalid' : ''}`}
                          value={state.password}
                          onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                          onBlur={() => setPasswordTouched(true)}
                          required
                        />
                      </div>
                      {showRules && (
                        <ul className="_password_rules _mar_b14">
                          {PASSWORD_RULES.map(rule => {
                            const met = rule.test(state.password);
                            return (
                              <li key={rule.key} className={`_password_rule${met ? ' _password_rule_met' : ' _password_rule_unmet'}`}>
                                <span className="_password_rule_icon">{met ? '✓' : '✗'}</span>
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="form-check _social_registration_form_check _mar_b20">
                        <input className="form-check-input _social_registration_form_check_input" type="checkbox" id="terms" required />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="terms">I agree to terms & conditions</label>
                      </div>
                      <div className="_social_registration_form_btn _mar_b40">
                        <button type="submit" className="_social_registration_form_btn_link _btn1">Register Now</button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
