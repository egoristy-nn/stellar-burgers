import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  console.log(props);
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }

  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    if (!response.success) {
      return Promise.reject(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear(); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
        dispatch(userLogout()); // удаляем пользователя из хранилища
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: { name: string; email: string; password: string }) => {
    const response = await registerUserApi(data);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: { name: string; email: string; password: string }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response;
  }
);

interface UserState {
  isAuthChecked: boolean;
  isAuthorized: boolean;
  name: string;
  email: string;
  loginUserRequest: boolean;
  loginUserError: string | null;
  accessToken: string;
  refreshToken: string;
}

const initialState: UserState = {
  isAuthChecked: false,
  isAuthorized: false,
  name: '',
  email: '',
  loginUserRequest: false,
  loginUserError: null,
  accessToken: '',
  refreshToken: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = false;
    },
    userLogout: (state) => {
      state.isAuthorized = false;
      state.name = '';
      state.email = '';
      state.accessToken = '';
      state.refreshToken = '';
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    },
    setUser(state, action) {
      state.isAuthorized = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearUser() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthorized = true;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.isAuthChecked = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Failed to login';
        state.isAuthChecked = true;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthorized = true;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.isAuthChecked = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Failed to register';
        state.isAuthChecked = true;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.isAuthorized = false;
        state.isAuthChecked = true;
        state.name = '';
        state.email = '';
        state.accessToken = '';
        state.refreshToken = '';
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Failed to logout';
        state.isAuthChecked = true;
      });

    builder
      .addCase(updateUser.pending, (state, action) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthorized = true;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Failed to register';
        state.isAuthChecked = true;
      });
  }
});

export const { authChecked, userLogout, setUser, clearUser } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
