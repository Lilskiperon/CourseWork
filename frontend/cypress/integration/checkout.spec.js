
describe('Checkout Flow', () => {

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

  


  it('додає товар і оформлює замовлення', () => {
    cy.get('input[placeholder="Enter the name of the product"]').type('Whey');
    cy.get('li.dropdown-item').should('be.visible').first().click();
    cy.url().should('include', '/product/');  
    cy.wait(1000);
    cy.get('button.add-to-cart-btn').should('contain', 'Add to cart').click();

    cy.get('div.cart svg.svgicon').should('be.visible').click();
    cy.contains('Proceed to checkout').click();


    cy.get('input[placeholder="Enter e-mail"]').type(testEmail);
    cy.get('input[placeholder="Enter your password"]').type('Password123');
    cy.get('input[placeholder="Name"]').type('Cypress');
    cy.get('input[placeholder="Last name"]').type('Ivanov');
    cy.get('input[name="phone"]').type('0123456789');
    cy.get('button.apply-order').click();
    // заповнення форми доставки
    cy.get('input[name="fullName"]').type('Cypress Ivanov');
    cy.get('select[name="country"]').should('be.visible').select('Ukraine');
    cy.get('input[name="region"]').type('Odesa');
    cy.get('input[name="city"]').type('Odesa');
    cy.get('input[name="postalCode"]').type('01001');
    cy.get('input[name="address"]').type('123 Test St');
    cy.contains('Confirm order').click();


    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="cardNumber"]').type(4242424242424242);
    cy.get('input[name="cardExpiry"]').type(1125);
    cy.get('input[name="cardCvc"]').type(252);
    cy.get('input[name="billingName"]').type('Cypress Ivanov');
    cy.get('div.SubmitButton-IconContainer').click();
    // перевірка, що замовлення успішно оформлено
    cy.contains('Your order has been accepted.').should('be.visible');
  });

});