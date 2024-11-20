import {
  getIngredientsApi,
  getFeedsApi,
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export interface BurgerState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
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

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action) => {
      const newIngredient: TConstructorIngredient = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.constructorItems.ingredients.push(newIngredient);
    },
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveUp: (state, action) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (currentIndex > 0) {
        const currentElement = state.constructorItems.ingredients[currentIndex];
        const previousElement =
          state.constructorItems.ingredients[currentIndex - 1];
        state.constructorItems.ingredients[currentIndex] = previousElement;
        state.constructorItems.ingredients[currentIndex - 1] = currentElement;
      }
    },
    moveDown: (state, action) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (currentIndex < state.constructorItems.ingredients.length - 1) {
        const currentElement = state.constructorItems.ingredients[currentIndex];
        const nextElement =
          state.constructorItems.ingredients[currentIndex + 1];
        state.constructorItems.ingredients[currentIndex] = nextElement;
        state.constructorItems.ingredients[currentIndex + 1] = currentElement;
      }
    },
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.orderModalData = null;
      state.orderRequest = false;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
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
  closeModal,
  clearConstructor
} = burgerSlice.actions;
