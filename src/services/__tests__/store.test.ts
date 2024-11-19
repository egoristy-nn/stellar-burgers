import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('Проверяет правильную инициализацию rootReducer', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      burger: {
        ingredients: [],
        loading: false,
        error: null,
        constructorItems: {
          bun: null,
          ingredients: []
        },
        ingredientData: [],
        orderRequest: false,
        orderModalData: null,
        isModalOpen: false,
        feed: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        orderInfo: [],
        myOrders: []
      },
      user: {
        isAuthChecked: false,
        isAuthorized: false,
        name: '',
        email: '',
        loginUserRequest: false,
        loginUserError: null,
        accessToken: '',
        refreshToken: ''
      }
    });
  })
});
