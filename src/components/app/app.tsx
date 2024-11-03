import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../protected-route/ProtectedRoute';
import { Provider } from 'react-redux';
import store, { useDispatch } from '../../services/store';
import { getUserApi } from '@api';
import { useEffect } from 'react';
import {
  clearUser,
  getCookie,
  setUser
} from '../../services/reducers/UserReducer';
const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        try {
          const userData = await getUserApi();
          if (userData && userData.success) {
            dispatch(setUser(userData.user));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          console.error('Ошибка получения данных пользователя:', error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    };

    initializeUser();
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <Provider store={store}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route
            path='/profile'
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<ProtectedRoute element={<ProfileOrders />} />}
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </Provider>
    </div>
  );
};

export default App;
