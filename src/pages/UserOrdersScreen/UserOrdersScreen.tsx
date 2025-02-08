import React, { useCallback, useEffect, useState } from 'react';
import cn from 'clsx';
import { useGetProfileQuery } from 'src/entities/Profile/api/profileApi';
import ComponentFetchList from 'src/shared/ui/ComponentFetchList/ComponentFetchList';
import { Loader } from 'src/shared/ui/Loader/Loader';
import UserOrdersFiltersForm from './UserOrdersFiltersForm/UserOrdersFiltersForm';
import styles from './UserOrdersScreen.module.scss';
import {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '../../entities/Order/api/orderApi';
import OrderItem from '../../entities/Order/ui/OrderItem/OrderItem';
import OrderProductItem from '../../entities/Product/ui/OrderProductItem/OrderProductItem';
import useDataListController from '../../shared/hooks/useDataListController';
import { MutateOrderBody, Order, OrdersFilters } from '../../shared/types/serverTypes';
import PageLayout from '../../shared/ui/PageLayout/PageLayout';

const UserOrdersScreen: React.FC = () => {
  const { data, isUninitialized, isLoading: isLoadingProfile } = useGetProfileQuery();
  const userId = data?.id;

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const {
    items,
    handlerPermanentFiltersChange,
    currentFilters,
    handlerFiltersChange,
    handlerFetchItems,
    isLoading: isLoadingOrder,
  } = useDataListController<Order, OrdersFilters, MutateOrderBody>(
    useGetOrdersQuery,
    useUpdateOrderMutation,
    useCreateOrderMutation,
  );

  useEffect(() => {
    handlerPermanentFiltersChange({ userId: userId });
  }, [userId]);

  const renderCallback = useCallback(
    (item: Order) => (
      <div
        className={cn({ [styles.selectedOrder]: currentOrder === item })}
        key={item.id}
        onClick={() => handleClick(item)}
      >
        <OrderItem
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
          status={item.status}
          totalPrice={item.products.reduce(
            (total, product) => total + product.product.price * product.quantity,
            0,
          )}
        />
      </div>
    ),
    [currentOrder],
  );

  const handleClick = (order: Order) => {
    setCurrentOrder((prev) => (prev === order ? null : order));
  };

  if (isUninitialized || isLoadingOrder || isLoadingProfile) {
    // return <div>{'loading'}</div>;
    return <Loader />;
  }

  return (
    <>
      <PageLayout
        header={<></>}
        footer={<></>}
        sidebar={
          <UserOrdersFiltersForm initialFilters={currentFilters} onChange={handlerFiltersChange} />
        }
      >
        <div className={styles.content}>
          <div className={styles.orders}>
            <ComponentFetchList
              doFetch={handlerFetchItems}
              items={items}
              render={renderCallback}
              oneObserve={true}
            />
          </div>
          <div className={styles.products}>
            {currentOrder &&
              currentOrder.products.map((item) => (
                <div key={item._id}>
                  <OrderProductItem
                    photo={item.product.photo}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                  />
                </div>
              ))}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default UserOrdersScreen;
