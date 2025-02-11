import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    firstName: "",
    phone: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  setLoading(true);  

  try {
    const result = await registerUser(formData);
    alert("Регистрация выполнена успешно!");
    console.log("Результат регистрации:", result);
    setLoading(false);  
  } catch (error) {
    setError(error.message); 
    console.error("Ошибка регистрации:", error);
    setLoading(false);  
  }
};

const eyeRef = useRef(null);
const pupilRef = useRef(null); 

const handleMouseMove = (e) => {
  const eye = eyeRef.current;
  const pupil = pupilRef.current;
  const eyeRect = eye.getBoundingClientRect();
  
  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2 ;
  
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Вычисляем смещение от центра глаза
  const deltaX = mouseX - eyeCenterX;
  const deltaY = mouseY - eyeCenterY;

  const maxDistance = eyeRect.width / 5;

  // Вычисляем угол, под которым должен двигаться зрачок
  const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
  const angle = Math.atan2(deltaY, deltaX)
  // Перемещаем зрачок
  const pupilX = distance * Math.cos(angle);
  const pupilY = distance * Math.sin(angle)
  pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
};


useEffect(() => {
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, []);

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
        <div className="form-container">
        <label>Ваша почта</label>
        <input
          type="email"
          name="email"
          placeholder="Введите e-mail"
          onChange={handleChange}
          required
        />

        <label>Пароль</label>
        <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Введите ваш пароль"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`toggle-password ${passwordVisible ? "open" : ""}`}>
              <svg className={`eye-icon ${passwordVisible ? "open" : ""}`} onMouseMove={handleMouseMove}>
                {/* Глаз */}
                <use  ref={eyeRef}  href={`/assets/svg/sprite-icons.svg#icon-eye${passwordVisible ? "-off" : ""}`}></use>
                {/* Зрачок */}
                <circle
                  ref={pupilRef}
                  cx="12"
                  cy="12"
                  r="4"
                  fill="#000000"
                  style={{ transform: "translate(0px, 0px)" }}
                />
              </svg>
            </button>
          </div>

        <label>Повторите пароль</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторите пароль"
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-container">

        <label>Имя</label>
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          onChange={handleChange}
        />

        <label>Фамилия</label>
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          onChange={handleChange}
        />

        <label>Ваш телефон</label>
        <input
          type="tel"
          name="phone"
          placeholder="Ваш телефон"
          onChange={handleChange}
        />
        <div className="submit-btn">
        <button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button></div>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Отображение ошибки */}
      
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
