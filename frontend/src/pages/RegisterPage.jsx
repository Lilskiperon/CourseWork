import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  const { signup, loading } = useUserStore();
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
      alert("Пароли не совпадают!");
      return;
    }
    const formData = {
      email,
      password,
      firstName,
      lastName,
      phone,
    };
    signup(formData);


  };


  return (
    <div className="auth-block">
      <h1>РЕГИСТРАЦИЯ</h1>
        <p>
        Уже есть аккаунт?{" "}
        <Link to="/login" className="auth-link">
          Войдите
        </Link>
        </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ваша почта</label>
          <input
            type="email"
            value={email}
            placeholder="Введите e-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </div>
        <div className="form-group">
          <label>Пароль</label>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              placeholder="Введите ваш пароль"
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
        <label>Повторите пароль</label>
        <input
          type="password"
          value={confirmPassword}
          placeholder="Повторите пароль"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        </div>
        <div className="form-group">
        <label>Имя</label>
        <input
          type="text"
          value={firstName}
          placeholder="Имя"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
        <div className="form-group">
        <label>Фамилия</label>
        <input
          type="text"
          value={lastName}
          placeholder="Фамилия"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
        <div className="form-group">
        <label>Ваш телефон</label>
        <input
          type="tel"
          value={phone} 
          placeholder="Ваш телефон"
          onChange={(e) => setPhone(e.target.value)}
        />
        </div>
        <div className="submit-btn">
          <button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button></div>
      </form>
      
    <div className="horizontal_line" ></div>
    <h4>Вход в один клик:</h4>
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
