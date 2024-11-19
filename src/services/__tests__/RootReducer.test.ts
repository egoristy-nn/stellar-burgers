import { configureStore } from "@reduxjs/toolkit";
import {  addIngredient, burgerReducer, burgerSlice, BurgerState, fetchFeed, fetchIngredients, fetchMyOrders, fetchOrder, moveDown, moveUp, removeIngredient } from "../reducers/RootReducer"
import thunk from 'redux-thunk';
import { rootReducer } from "../store";
import { TOrder } from "@utils-types";

describe('burgerSlice', () => {
    let initialState: BurgerState;
    beforeEach(() => {
      initialState = {
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
    })

    it('добавляет ингредиент в конструктор', () => {
      const newState = burgerSlice.reducer(initialState, addIngredient({
        _id: '1',
        name: 'test',
        type: 'test',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'test',
        image_large: 'test',
        image_mobile: 'test'
      }))

      const { constructorItems } = newState

      expect(constructorItems).toEqual({
        bun: null,
        ingredients: [
          {
            _id: '1',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: expect.any(String)
          }
        ]
      })
    })

    it('удаляет ингредиент из конструктора', () => {
      const newState = burgerSlice.reducer(initialState, removeIngredient({
        _id: '1',
        name: 'test',
        type: 'test',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'test',
        image_large: 'test',
        image_mobile: 'test'
      }))

      const { constructorItems } = newState

      expect(constructorItems).toEqual({
        bun: null,
        ingredients: []
      })
    })

    it('перемещает ингредиент вверх', () => {
      initialState.constructorItems = {
        bun: null,
        ingredients: [
          {
            _id: '1',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '100'
          },
          {
            _id: '2',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '200'
          }
        ]
      }
      const newState = burgerSlice.reducer(initialState, moveUp('200'))

      const { constructorItems } = newState

      expect(constructorItems).toEqual({
        bun: null,
        ingredients: [
          {
            _id: '2',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '200'
          },
          {
            _id: '1',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '100'
          }
        ]
      })
    })

    it('перемещает ингредиент вниз', () => {
      initialState.constructorItems = {
        bun: null,
        ingredients: [
          {
            _id: '1',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '100'
          },
          {
            _id: '2',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '200'
          }
        ]
      }
      const newState = burgerSlice.reducer(initialState, moveDown('100'))

      const { constructorItems } = newState

      expect(constructorItems).toEqual({
        bun: null,
        ingredients: [
          {
            _id: '2',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '200'
          },
          {
            _id: '1',
            name: 'test',
            type: 'test',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'test',
            image_large: 'test',
            image_mobile: 'test',
            id: '100'
          }
        ]
      })
    })
})

describe('fetchIngredients', () => {
    let initialState: BurgerState;
    beforeEach(() => {
      initialState = {
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
    });
    
    it('loading=true, error=null while pending', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchIngredients.pending('')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    })
    
    it('loading=false, error=null, ingredients=[ingredient], ingredientData=[ingredient] while fulfilled', () => {
      const newIngredient = {
        _id: '1',
        name: 'test',
        type: 'test',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'test',
        image_large: 'test',
        image_mobile: 'test',
        id: '100'
      }
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchIngredients.fulfilled([newIngredient], '')
      )
      expect(newState).toEqual({
        ...initialState,
        ingredients: [newIngredient],
        ingredientData: [newIngredient],
        loading: false,
        error: null
      })
    })

    it('loading=false, error=error.message while rejected', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchIngredients.rejected(new Error('Test error'), '')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: 'Test error'
      })
    })
})

describe('fetchOrder', () => {
    let initialState: BurgerState;
    beforeEach(() => {
      initialState = {
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
    });

    it('loading=true, error=null while pending', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchOrder.pending('', [])
      )
      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    })

    it('loading=false, error=null, orderModalData=order while fulfilled', () => {
      const newOrder = {
        order: {
          _id: '1',
          name: 'test',
          ingredients: ['1', '2'],
          status: 'test',
          number: 1,
          createdAt: 'test',
          updatedAt: 'test'
        },
        success: true,
        name: 'testOrder'
      }
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchOrder.fulfilled(newOrder, '', [])
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: null,
        orderModalData: newOrder.order,
        myOrders: [newOrder.order]
      })
    })

    it('loading=false, error=error.message while rejected', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchOrder.rejected(new Error('Test error'), '', [])
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: 'Test error'
      })
    })
  }
)

describe('fetchFeed', () => {
    let initialState: BurgerState;
    beforeEach(() => {
      initialState = {
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
    });

    it('loading=true, error=null while pending', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchFeed.pending('')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    })

    it('loading=false, error=null, feed=feed while fulfilled', () => {
      const newFeed = {
        orders: [
          {
            _id: '1',
            name: 'test',
            ingredients: ['1', '2'],
            status: 'test',
            number: 1,
            createdAt: 'test',
            updatedAt: 'test'
          }
        ],
        total: 1,
        totalToday: 1,
        success: true
      }
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchFeed.fulfilled(newFeed, '')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: null,
        feed: {
          orders: newFeed.orders,
          total: newFeed.total,
          totalToday: newFeed.totalToday
        },
        orderInfo: newFeed.orders
      })
    })

    it('loading=false, error=error.message while rejected', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchFeed.rejected(new Error('Test error'), '')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: 'Test error'
      })
    })
})

describe('fetchMyOrders', () => {
    let initialState: BurgerState;
    beforeEach(() => {
      initialState = {
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
    });

    it('loading=true, error=null while pending', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchMyOrders.pending('')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    })

    it('loading=false, error=null, myOrders=myOrders while fulfilled', () => {
      const newOrders = [
        {
          _id: '1',
          name: 'test',
          ingredients: ['1', '2'],
          status: 'test',
          number: 1,
          createdAt: 'test',
          updatedAt: 'test'
        }
      ]
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchMyOrders.fulfilled(newOrders, '')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: null,
        myOrders: newOrders
      })
    })

    it('loading=false, error=error.message while rejected', () => {
      const newState = burgerSlice.reducer(
        {
          ...initialState,
          error: new Error('Test error').message,
        },
        fetchMyOrders.rejected(new Error('Test error'), '')
      )
      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error: 'Test error'
      })
    })
})
