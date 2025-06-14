import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CardProduct from '../../src/components/cards/CardProduct';
import * as productsApi from '../../src/api/products';
import { useCartStore } from '../../src/stores/useCartStore';

jest.mock('../../src/api/products');

jest.mock('../../src/stores/useCartStore', () => ({
  useCartStore: jest.fn()
}));

describe('CardProduct component', () => {
  const addToCart = jest.fn();
  const removeFromCart = jest.fn();
  beforeEach(() => {
    useCartStore.mockReturnValue({
      cart: [],
      wishlist: [],
      comparison: [],
      addToCart,
      removeFromCart,
      addToWishlist: jest.fn(),
      removeFromWishlist: jest.fn(),
      addToComparison: jest.fn(),
      removeFromComparison: jest.fn()
    });
    productsApi.getFlavors.mockResolvedValue([
      { _id: 'flavor1', flavorName: 'Vanilla', stockQuantity: 10 }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls addToCart when button clicked', async () => {
    const product = {
      _id: 'pack1',
      productId: { _id: 'prod1', productName: 'Test', description: '' },
      price: 5,
      weight: 100,
      productImageUrl: ''
    };

    const { getByText } = render(<CardProduct product={product} />);

    await waitFor(() => {
      expect(productsApi.getFlavors).toHaveBeenCalled();
    });

    const button = getByText('Add to cart');
    fireEvent.click(button);
    expect(addToCart).toHaveBeenCalled();
  });

  it('removes item from cart when already added', async () => {
    useCartStore.mockReturnValue({
      cart: ['flavor1'],
      wishlist: [],
      comparison: [],
      addToCart,
      removeFromCart,
      addToWishlist: jest.fn(),
      removeFromWishlist: jest.fn(),
      addToComparison: jest.fn(),
      removeFromComparison: jest.fn()
    });

    const product = {
      _id: 'pack1',
      productId: { _id: 'prod1', productName: 'Test', description: '' },
      price: 5,
      weight: 100,
      productImageUrl: ''
    };

    const { getByText } = render(<CardProduct product={product} />);

    await waitFor(() => {
      expect(productsApi.getFlavors).toHaveBeenCalled();
    });

    const button = getByText('Remove from basket');
    fireEvent.click(button);
    expect(removeFromCart).toHaveBeenCalledWith('flavor1');
  });
});