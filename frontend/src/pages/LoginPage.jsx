import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
function LoginPage() {
  const {user, login} = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = {
      email,
      password,
      rememberMe,
    };

    const { success } = await login(formData);
    if(success) { navigate("/profile");}
  };

  return (
    <div className="auth-block">
      <h1>ENTRANCE</h1>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Sign up
        </Link>
      </p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Your mail</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
        </div>
        <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        <div className="submit-btn">
          <button type="submit">Log in</button>
        </div>
      </form>

      <div className="horizontal_line"></div>
      <h4>One-click login:</h4>
      <div className="social-icons">
        <a href="#" className="social-icon fb">
          <svg className="svgicon">
            <use href="/assets/svg/sprite-icons.svg#icon-facebook"></use>
          </svg>
        </a>
        <a href="#" className="social-icon google">
          <svg className="svgicon">
            <use href="/assets/svg/sprite-icons.svg#icon-google"></use>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
