const { getSearchProductsByParams } = require('../controllers/packagingController');
const { Packaging } = require('../models');

jest.mock('../models', () => ({
  Packaging: { find: jest.fn() }
}));

describe('getSearchProductsByParams', () => {
  it('filters products by brand and category', async () => {
    const req = {
      query: {
        brand: 'BrandA',
        category: 'Snack',
        priceMin: '10',
        priceMax: '20',
        limit: '2',
        page: '1'
      }
    };
    const json = jest.fn();
    const res = { json, status: jest.fn().mockReturnThis() };

    const mockProducts = [
      { productId: { brand: 'BrandA', category: 'Snack' }, price: 15 },
      { productId: { brand: 'BrandB', category: 'Snack' }, price: 12 },
      { productId: { brand: 'BrandA', category: 'Drink' }, price: 18 }
    ];

    const mockSort = jest.fn().mockResolvedValue(mockProducts);
    const mockPopulate = jest.fn(() => ({ sort: mockSort }));
    Packaging.find.mockReturnValue({ populate: mockPopulate });

    await getSearchProductsByParams(req, res);

    expect(Packaging.find).toHaveBeenCalledWith({ price: { $gte: 10, $lte: 20 } });
    expect(json).toHaveBeenCalledWith({ products: [mockProducts[0]], hasMore: false });
  });
});