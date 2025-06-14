import '@testing-library/jest-dom';

// Полифилл для TextEncoder/TextDecoder (нужен React Router и jsdom)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;