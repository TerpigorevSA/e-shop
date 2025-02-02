import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import styles from './UserOrdersScreen.module.css';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../../app/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../entities/User/model/thunks';
import OrderItem from '../../entities/Order/ui/OrderItem/OrderItem';
import { MutateOrderBody, Order, OrdersFilters } from '../../shared/types/serverTypes';
import OrderProductItem from '../../entities/Product/ui/OrderProductItem/OrderProductItem';
import ComponentFetchList from 'src/shared/ui/ComponentFetchList/ComponentFetchList';
import useDataListController from '../../shared/hooks/useDataListController';
import { useCreateOrderMutation, useGetOrdersQuery, useUpdateOrderMutation } from '../../entities/Order/api/orderApi';
import PageLayout from '../../shared/ui/PageLayout/PageLayout';
import UserOrdersFiltersForm from './UserOrdersFiltersForm/UserOrdersFiltersForm';

const UserOrdersScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.currentUser?.id);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // const itemsEmpty = useSelector((state: RootState) => state.user.currentOrders.orders).length === 0;
  // const firstRender = useRef(true);

  // useEffect(() => {
  //   if (userId) {
  //     if (itemsEmpty && firstRender.current) {
  //       dispatch(getUserOrders({ userId: userId, pagination: { pageSize: 10, pageNumber: 1 } }));
  //     }
  //     firstRender.current = false;
  //   }
  // }, [userId]);

  // const items = useSelector((state: RootState) => state.user.currentOrders.orders);
  // const currentOrderStatus = useSelector((state: RootState) => state.user.currentOrders.status);
  // const currentOrdreError = useSelector((state: RootState) => state.user.currentOrders.error);
  // const pagination = useSelector((state: RootState) => state.user.currentOrders.pagination);

  // const pageTotal = Math.ceil(pagination.total / pagination.pageSize);

  // const handleFetchOrders = useCallback(() => {
  //   if (
  //     pagination.pageNumber !== pageTotal &&
  //     pagination.pageNumber !== 0 &&
  //     currentOrderStatus !== 'loading' &&
  //     currentOrderStatus !== 'failed'
  //   ) {
  //     dispatch(getUserOrders({ userId: userId, pagination: { pageSize: 10, pageNumber: pagination.pageNumber + 1 } }));
  //   }
  // }, [dispatch, pagination, pageTotal, currentOrderStatus]);

  const {
    items,
    handlerPermanentFiltersChange,
    currentFilters,
    handlerFiltersChange,
    handlerFetchItems,
    isFetching,
    isLoading,
    isError,
    isSuccess,
    error,
    editingItem,
    handlerEditItem,
    handlerAddClick,
    handlerEditClick,
    clearEditItem,
  } = useDataListController<Order, OrdersFilters, MutateOrderBody>(
    useGetOrdersQuery,
    useUpdateOrderMutation,
    useCreateOrderMutation
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
          totalPrice={item.products.reduce((total, product) => total + product.product.price * product.quantity, 0)}
        />
      </div>
    ),
    [currentOrder]
  );

  const handleClick = (order: Order) => {
    setCurrentOrder((prev) => (prev === order ? null : order));
  };

  return (
    <>
      <PageLayout
        header={<></>}
        footer={<></>}
        sidebar={<UserOrdersFiltersForm initialFilters={currentFilters} onChange={handlerFiltersChange} />}
      >
        <div className={styles.content}>
          <div className={styles.orders}>
            <ComponentFetchList doFetch={handlerFetchItems} items={items} render={renderCallback} oneObserve={true} />
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
      {/* <div className={styles.wrapper}>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <div className={styles.orders}>
            <ComponentFetchList doFetch={handlerFetchItems} items={items} render={renderCallback} oneObserve={true} />
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
        <div className={cn(styles.footer)}>
          <div className={styles.error}>
            {error && (error as string[]).map((str) => t(str)).join('\n')}
          </div>
          { {currentOrderStatus === 'loading' && <div>{t('CartScreen.loading')}</div>} }
        </div>
      </div> */}
    </>
  );
};

export default UserOrdersScreen;
