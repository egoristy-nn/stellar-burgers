import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchMyOrders } from '../../services/reducers/RootReducer';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.burger.myOrders
  );

  return <ProfileOrdersUI orders={orders} />;
};
