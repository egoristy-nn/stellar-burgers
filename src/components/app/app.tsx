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
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  FeedInfo
} from '@components';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams
} from 'react-router-dom';
import ProtectedRoute from '../protected-route/ProtectedRoute';
import { Provider, useSelector } from 'react-redux';
import store, { RootState, useDispatch } from '../../services/store';
import { getUserApi } from '@api';
import { useEffect } from 'react';
import {
  clearUser,
  getCookie,
  setUser
} from '../../services/reducers/UserReducer';
import {
  fetchFeed,
  fetchIngredients,
  fetchMyOrders
} from '../../services/reducers/RootReducer';

const App = () => {
  const navigate = useNavigate();
  const handleModalClose = () => navigate(-1);
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as { background?: Location };
  const background = locationState && locationState.background;
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeed());
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
    <>
      <div className={styles.app} data-cy='app'>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/register'
            element={<ProtectedRoute element={<Register />} />}
          />
          <Route
            path='/forgot-password'
            element={<ProtectedRoute element={<ForgotPassword />} />}
          />
          <Route
            path='/reset-password'
            element={<ProtectedRoute element={<ResetPassword />} />}
          />
          <Route
            path='/profile'
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<ProtectedRoute element={<ProfileOrders />} />}
          />
          <Route path='*' element={<NotFound404 />} />
          <Route
            path='/feed/:number'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  #{orderNumber && orderNumber.padStart(6, '0')}
                </p>
                <OrderInfo />
              </div>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_main-large ${styles.detailHeader}`}
                >
                  Детали ингредиента
                </p>
                <IngredientDetails />
              </div>
            }
          />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal
                  onClose={handleModalClose}
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal onClose={handleModalClose} title='Детали ингредиента'>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  onClose={handleModalClose}
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
