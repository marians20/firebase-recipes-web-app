import { useState } from 'react';
import FirebaseAuthService from '../FirebaseAuthService';

const LoginForm = ({ existingUser }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await FirebaseAuthService.loginUser(userName, password);
      setUserName('');
      setPassword('');
    }
    catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    FirebaseAuthService.logoutUser();
  };

  const handleSendResetPasswordEmail = async () => {
    if(!userName) {
      alert('Missing user name!');
      return;
    }

    try{
      await FirebaseAuthService.sendPasswordResetEmail(userName);
      alert('Reset password email has been send.');
    }
    catch(error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLoginWithGoogle = async() => {
    try{
      await FirebaseAuthService.loginWithGoogle();
    }
    catch(error) {
      alert(error.message);
    }
  };

  return (<>
    <div className="login-form-container">
      {
        existingUser ? <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button type="button" className="primary-button" onClick={handleLogout}>Logout</button>
        </div> : <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-label login-label">
            User Name (email):

            <input
              required
              type="email"
              className="input-text"
              value={userName}
              onChange={event => setUserName(event.target.value)} />
          </label>
          <label className="input-label login-label">
            Password:

            <input
              required
              type="password"
              className="input-text"
              value={password}
              onChange={event => setPassword(event.target.value)} />
          </label>
          <div className="button-box">
            <button className="primary-button">Login</button>
            <button type="button" className="primary-button" onClick={handleSendResetPasswordEmail}>Reset Password</button>
            <button type="button" className="primary-button" onClick={handleLoginWithGoogle}>Login with Google</button>
          </div>
        </form>
      }
    </div>
  </>);
};

export default LoginForm;