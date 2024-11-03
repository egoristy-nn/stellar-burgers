import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/reducers/RootReducer';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(
    (state: RootState) => state.burger.feed.orders
  );

  const handleGetFeeds = async () => {
    setLoading(true);
    await dispatch(fetchFeed());
    setLoading(false);
  };

  if (loading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
