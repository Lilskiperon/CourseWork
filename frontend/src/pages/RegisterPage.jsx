import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  const {user, signup, loading } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formData = {
      email,
      password,
      firstName,
      lastName,
      phone,
    };
    const { success } = await signup(formData);
    if(success) { navigate("/profile");}
  };


  return (
    <div className="auth-block">
      <h1>REGISTRATION</h1>
        <p>
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Log in
        </Link>
        </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your mail</label>
          <input
            type="email"
            value={email}
            placeholder="Enter e-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`toggle-password ${passwordVisible ? "open" : ""}`}>
              <svg className={`eye-icon ${passwordVisible ? "open" : ""}`}>
                <use  href={`/assets/svg/sprite-icons.svg#icon-eye${passwordVisible ? "-off" : ""}`}></use>
              </svg>
            </button>
          </div>
          </div>
        <div className="form-group">
        <label>Repeat password</label>
        <input
          type="password"
          value={confirmPassword}
          placeholder="Repeat password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        </div>
        <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={firstName}
          placeholder="Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
        <div className="form-group">
        <label>Last name</label>
        <input
          type="text"
          value={lastName}
          placeholder="Last name"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
        <div className="form-group">
        <label>Your phone</label>
        <input
          type="tel"
          value={phone} 
          placeholder="Your phone"
          onChange={(e) => setPhone(e.target.value)}
        />
        </div>
        <div className="submit-btn">
          <button type="submit" disabled={loading}>
            {loading ? "Download..." : "Sign up"}
        </button></div>
      </form>
      
    <div className="horizontal_line" ></div>
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

export default RegisterPage;
