import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/reducers/RootReducer';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.burger.feed.orders
  );
  const feed = useSelector((state: RootState) => state.burger.feed);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
