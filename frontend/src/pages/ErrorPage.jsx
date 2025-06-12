import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <h1 className="error-title">Oh!</h1>
                <p className="error-message">Something went wrong. Page not found..</p>
                <a className="error-link" href="/">Return to the main page</a>
            </div>
        </div>
    );
};

export default ErrorPage;