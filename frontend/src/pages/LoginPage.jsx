import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
function LoginPage() {
  const {login} = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = {
      email,
      password,
      rememberMe,
    };

    login(formData); 
  };

  return (
    <div className="auth-block">
      <h1>ВХОД</h1>
      <p>
        Нет аккаунта?{" "}
        <Link to="/register" className="auth-link">
          Зарегистрируйтесь
        </Link>
      </p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Ваша почта</label>
          <input
            type="email"
            placeholder="Введите e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
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
            <label htmlFor="remember">Запомнить меня</label>
        </div>
        <div className="forgot-password">
            <Link to="/forgot-password">Забыли пароль?</Link>
          </div>
        <div className="submit-btn">
          <button type="submit">Войти</button>
        </div>
      </form>

      <div className="horizontal_line"></div>
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

export default LoginPage;
