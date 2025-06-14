
describe('Authentication', () => {
  const getRandomEmail = (domain = 'example.com') => {
    const random = Math.random().toString(36).substring(2, 11);
    return `${random}@${domain}`;
  };

  let testEmail;

  beforeEach(() => {
    // Перед кожним тестом генеруємо нову пошту
    testEmail = getRandomEmail();
    cy.visit('/');
  });

  
  it('реєстрація, вхід і вихід', () => {
    cy.visit('/register');
    cy.get('input[placeholder="Enter e-mail"]').type(testEmail);
    cy.get('input[placeholder="Enter your password"]').type('Password123');
    cy.get('input[placeholder="Repeat password"]').type('Password123');
    cy.get('input[placeholder="Name"]').type('Cypress');
    cy.get('input[placeholder="Last name"]').type('Ivanov');
    cy.get('input[placeholder="Your phone"]').type('380123456789');
    cy.get('button[type="submit"]').click();
    cy.contains('Registration successful').should('be.visible');
    cy.reload();
    cy.contains('Welcome, Cypress Ivanov').should('be.visible');

    cy.contains('Exit').click();
    cy.visit('/login');
    cy.get('input[placeholder="Enter your email address"]').type(testEmail);
    cy.get('input[placeholder="Enter your password"]').type('Password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Login successful').should('be.visible');
    cy.reload();
    cy.contains('Welcome, Cypress Ivanov').should('be.visible');
  });
});
