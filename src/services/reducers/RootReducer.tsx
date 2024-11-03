import {
  getIngredientsApi,
  getFeedsApi,
  orderBurgerApi,
  getOrdersApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

interface BurgerState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredient[];
  };
  ingredientData: TIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isModalOpen: boolean;
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  orderInfo: TOrder[];
  myOrders: TOrder[];
}

export interface ConstructorItem {
  _id: string;
  price: number;
}

const initialState: BurgerState = {
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
};

export const fetchIngredients = createAsyncThunk(
  'burger/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export const fetchFeed = createAsyncThunk('burger/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchOrder = createAsyncThunk(
  'burger/fetchOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const fetchMyOrders = createAsyncThunk(
  'burger/fetchMyOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item._id !== action.payload
        );
    },
    moveUp: (state, action) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item._id === action.payload
      );
      if (index > 0) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] = temp;
      }
    },
    moveDown: (state, action) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item._id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = temp;
      }
    },
    closeModal: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.isModalOpen = false;
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.ingredientData = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });

    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.order;
        state.myOrders.push(action.payload.order);
        state.orderRequest = false;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });

    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.orderInfo = action.payload.orders;
        state.error = null;
        console.log(state.feed.orders);
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export const burgerReducer = burgerSlice.reducer;

export const {
  addIngredient,
  addBun,
  removeIngredient,
  moveUp,
  moveDown,
  closeModal
} = burgerSlice.actions;
