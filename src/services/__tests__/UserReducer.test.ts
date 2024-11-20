import { loginUser, logoutUser, registerUser, updateUser, userReducer, UserState } from "../reducers/UserReducer";

describe('userSlice', () => {
  let state: UserState;

  beforeEach(() => {
    state = {
      isAuthChecked: false,
      isAuthorized: false,
      name: '',
      email: '',
      loginUserRequest: false,
      loginUserError: null,
      accessToken: '',
      refreshToken: ''
    };
  });

  describe('loginUser', () => {
    it('loginUserRequest= true, loginUserError= null while pending', () => {
      const newState = userReducer({
        ...state,
      },
      loginUser.pending('', { email: '', password: '' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: true,
        loginUserError: null
      });
    })

    it('loginUserRequest= false, loginUserError= null while fulfilled', () => {
      const newState = userReducer({
        ...state,
      },
      loginUser.fulfilled({
        user: {
          name: 'user-name',
          email: 'user-email'
        },
        accessToken: 'user-token',
        refreshToken: 'user-refresh-token',
        success: true
      },'', { email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: null,
        isAuthorized: true,
        isAuthChecked: true,
        name: 'user-name',
        email: 'user-email',
        accessToken: 'user-token',
        refreshToken: 'user-refresh-token'
      });
    })

    it('loginUserRequest= false, loginUserError= error while rejected', () => {
      const newState = userReducer({
        ...state,
      },
      loginUser.rejected(new Error('error'),'', { email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: 'error',
        isAuthChecked: true
      });
    })
  })

  describe('registerUser', () => {
    it('loginUserRequest= true, loginUserError= null while pending', () => {
      const newState = userReducer({
        ...state,
      },
      registerUser.pending('', { name: '', email: '', password: '' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: true,
        loginUserError: null
      });
    })

    it('loginUserRequest= false, loginUserError= null while fulfilled', () => {
      const newState = userReducer({
        ...state,
      },
      registerUser.fulfilled({
        user: {
          name: 'user-name',
          email: 'user-email'
        },
        accessToken: 'user-token',
        refreshToken: 'user-refresh-token',
        success: true
      },'', { name: 'user-name', email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: null,
        isAuthorized: true,
        isAuthChecked: true,
        name: 'user-name',
        email: 'user-email',
        accessToken: 'user-token',
        refreshToken: 'user-refresh-token'
      });
    })

    it('loginUserRequest= false, loginUserError= error while rejected', () => {
      const newState = userReducer({
        ...state,
      },
      registerUser.rejected(new Error('error'),'', { name: 'user-name', email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: 'error',
        isAuthChecked: true
      });
    })
  })

  describe('logoutUser', () => {
    it('loginUserRequest= true, loginUserError= null while pending', () => {
      const newState = userReducer({
        ...state,
      },
      logoutUser.pending('')
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: true,
        loginUserError: null
      });
    })

    it('loginUserRequest= false, loginUserError= null while fulfilled', () => {
      const newState = userReducer({
        ...state,
      },
      logoutUser.fulfilled(void 0, '')
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: null,
        isAuthorized: false,
        isAuthChecked: true,
        name: '',
        email: '',
        accessToken: '',
        refreshToken: ''
      });
    })

    it('loginUserRequest= false, loginUserError= error while rejected', () => {
      const newState = userReducer({
        ...state,
      },
      logoutUser.rejected(new Error('error'), '')
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: 'error',
        isAuthChecked: true
      });
    })
  })

  describe('updateUser', () => {
    it('loginUserRequest= true, loginUserError= null while pending', () => {
      const newState = userReducer({
        ...state,
      },
      updateUser.pending('', { name: '', email: '', password: '' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: true,
        loginUserError: null
      });
    })

    it('loginUserRequest= false, loginUserError= null while fulfilled', () => {
      const newState = userReducer({
        ...state,
      },
      updateUser.fulfilled({
        user: {
          name: 'user-name1',
          email: 'user-email1'
        },
        success: true
      },'', { name: 'user-name', email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        isAuthorized: true,
        isAuthChecked: true,
        name: 'user-name1',
        email: 'user-email1'
      });
    })

    it('loginUserRequest= false, loginUserError= error while rejected', () => {
      const newState = userReducer({
        ...state,
      },
      updateUser.rejected(new Error('error'),'', { name: 'user-name', email: 'user-email', password: 'user-password' })
      );

      expect(newState).toEqual({
        ...state,
        loginUserRequest: false,
        loginUserError: 'error',
        isAuthChecked: true
      });
    })
  })
});
