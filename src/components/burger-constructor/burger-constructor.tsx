import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  ConstructorItem,
  clearConstructor,
  closeModal,
  fetchOrder
} from '../../services/reducers/RootReducer';
import { RootState, useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthorized = useSelector(
    (state: RootState) => state.user.isAuthorized
  );
  const constructorItems = useSelector(
    (state: RootState) => state.burger.constructorItems
  );

  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );

  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );

  const Ids: string[] = [];
  const ingredientsIds = constructorItems.ingredients.map(
    (ingredient) => ingredient._id
  );
  if (constructorItems.bun) {
    Ids.push(constructorItems.bun._id);
    Ids.push(constructorItems.bun._id);
    ingredientsIds.forEach((id) => Ids.push(id));
  }

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }
    if (!isAuthorized) {
      navigate('/login');
      return;
    }
    dispatch(fetchOrder(Ids));
    dispatch(clearConstructor());
  };
  const closeOrderModal = () => {
    if (!orderRequest) {
      dispatch(closeModal());
      navigate('/');
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: ConstructorItem) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
