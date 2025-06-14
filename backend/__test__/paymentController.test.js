const { calculateTotalAmount } = require('../controllers/paymentController');

describe('calculateTotalAmount', () => {
  it('calculates total without discount', () => {
    const products = [
      { packagingId: { price: 10 }, quantity: 2 },
      { packagingId: { price: 5 }, quantity: 1 }
    ];
    const total = calculateTotalAmount(products);
    expect(total).toBe(10 * 100 * 2 + 5 * 100 * 1);
  });

  it('applies discount percentage', () => {
    const products = [
      { packagingId: { price: 10 }, quantity: 1 }
    ];
    const total = calculateTotalAmount(products, 10); // 10% discount
    expect(total).toBe(Math.round((10 * 100) * 0.9));
  });

  it('defaults quantity to 1 when not provided', () => {
    const products = [
      { packagingId: { price: 8 } }
    ];
    const total = calculateTotalAmount(products);
    expect(total).toBe(8 * 100);
  });

  it('handles multiple products with discount', () => {
    const products = [
      { packagingId: { price: 10 }, quantity: 3 },
      { packagingId: { price: 20 }, quantity: 1 }
    ];
    const total = calculateTotalAmount(products, 20);
    const expected = Math.round((10 * 100 * 3 + 20 * 100) * 0.8);
    expect(total).toBe(expected);
  });
});