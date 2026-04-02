import React, { useReducer, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginReducer } from './Login.reducer';
import { handleLoginAction } from './Login.actions';
import { googleLogin } from '../../services/apiService';
import './Login.css';

declare global {
  interface Window {
    google: any;
    _gsi_client?: any;
    _gsi_initialized?: boolean;
  }
}

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(loginReducer, { email: '', password: '', remember: false, error: '' });

  useEffect(() => {
    /* global google */
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
        dispatch({ type: 'SET_ERROR', payload: err.response?.data || 'Google Login failed' });
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
    await handleLoginAction(state, dispatch, setUser);
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
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
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b20">
                  <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
                </div>
                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b30">Login to your account</h4>
                {state.error && <div className="alert alert-danger">{state.error}</div>}
                
                <button 
                  type="button" 
                  className="_social_login_content_btn _mar_b30"
                  onClick={handleGoogleClick}
                >
                  <img src="/assets/images/google.svg" alt="Image" className="_google_img" /> 
                  <span>Sign-in with google</span>
                </button>

                <div className="_social_login_content_bottom_txt _mar_b30"> 
                  <span>Or</span>
                </div>

                <form className="_social_login_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Email</label>
                        <input type="email" className="form-control _social_login_input" value={state.email} onChange={e => dispatch({type: 'SET_EMAIL', payload: e.target.value})} required />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Password</label>
                        <input type="password" className="form-control _social_login_input" value={state.password} onChange={e => dispatch({type: 'SET_PASSWORD', payload: e.target.value})} required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input 
                          className="form-check-input _social_login_form_check_input" 
                          type="checkbox" 
                          id="remember" 
                          checked={state.remember}
                          onChange={e => dispatch({type: 'SET_REMEMBER', payload: e.target.checked})}
                        />
                        <label className="form-check-label _social_login_form_check_label" htmlFor="remember">Remember me</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t30 _mar_b40">
                        <button type="submit" className="_social_login_form_btn_link _btn1">Login now</button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">Dont have an account? <Link to="/register">Create New Account</Link></p>
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
