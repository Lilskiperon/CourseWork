import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <h1 className="error-title">Ой!</h1>
                <p className="error-message">Что-то пошло не так. Страница не найдена.</p>
                <a className="error-link" href="/">Вернуться на главную страницу</a>
            </div>
        </div>
    );
};

export default ErrorPage;