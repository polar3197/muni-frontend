import { useState } from "react";
import "../../styles/login.css";
import { login_user } from '../../api.js';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [member, setMember] = useState(true);
  const [memberStatus, setMemberStatus] = useState("not a member?")
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (member) {
      setMember(false);
      setMemberStatus("ur a member?");
    } else {
      setMember(true);
      setMemberStatus("not a member?");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Placeholder form for future auth wiring.
    console.log("login", { username, password });
    const member = {
      username: username,
      password: password
    };

    // axios api interface handles HTTP errors for now
    const response = await login_user(member);
    console.log(response);

    // store the users username and token for profile access and member rights
    login(username, response.access_token);

    // figure out how to navigate to logged in users Profile and how to 
    navigate("/profile");
  }

  return (
      <div className="login-container">
        <div className="login-body">
          {member && <form className="user-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <div className="input-title">un:</div>
              <input
                type="text"
                placeholder=""
                onChange={(event) => setUsername(event.target.value)}
                value={username}
              />
            </div>
            <div className="input-wrapper">
              <div className="input-title">pw:</div>
              <input
                type="password"
                placeholder=""
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </div>
            <button type="submit">login</button>
          </form>}
          {!member && <div className="non-member">
            <button>view artists profiles</button>
            <button>request account</button>
          </div>}
        </div>
        <div className="login-footer">
          <button onClick={handleClick}>{memberStatus}</button>
        </div>
      </div>
  );
}
