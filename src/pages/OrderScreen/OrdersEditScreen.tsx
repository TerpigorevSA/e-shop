import React, { useCallback, useState } from 'react';
import cn from 'clsx';
import { useTranslation } from 'react-i18next';
import EditOrderItem from 'src/entities/Order/ui/EditOrderItem/EditOrderItem';
import ComponentFetchList from 'src/shared/ui/ComponentFetchList/ComponentFetchList';
import styles from './OrdersEditScreen.module.scss';
import OrdersFiltersForm from './OrdersFiltersForm/OrdersFiltersForm';
import {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '../../entities/Order/api/orderApi';
import OrderProductItem from '../../entities/Product/ui/OrderProductItem/OrderProductItem';
import useDataListController from '../../shared/hooks/useDataListController';
import { MutateOrderBody, Order, OrdersFilters, OrderStatus } from '../../shared/types/serverTypes';
import PageLayout from '../../shared/ui/PageLayout/PageLayout';

const OrdersEditScreen: React.FC = () => {
  const { t } = useTranslation();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const { items, currentFilters, handlerFiltersChange, handlerFetchItems, handlerEditItem, error } =
    useDataListController<Order, OrdersFilters, MutateOrderBody>(
      useGetOrdersQuery,
      useUpdateOrderMutation,
      useCreateOrderMutation,
    );

  const handlerStatusChange = useCallback(
    (status: OrderStatus, item: Order) => {
      const oldItem = items.find((i) => i.id === item.id);
      if (oldItem) {
        const body: MutateOrderBody = {
          status: status,
          products: oldItem.products.map((product) => ({
            id: product.product.id,
            quantity: product.quantity,
          })),
        };
        handlerEditItem(item.id, body);
      }
    },
    [items],
  );

  const renderCallback = useCallback(
    (item: Order) => (
      <div
        className={cn({ [styles.selectedOrder]: currentOrder === item })}
        key={item.id}
        onClick={() => handleClick(item)}
      >
        <EditOrderItem
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
          status={item.status}
          totalPrice={item.products.reduce(
            (total, product) => total + product.product.price * product.quantity,
            0,
          )}
          id={item.id}
          email={item.user.name ?? ''}
          onStatusChange={(status: OrderStatus) => handlerStatusChange(status, item)}
        />
      </div>
    ),
    [currentOrder],
  );

  const handleClick = (order: Order) => {
    setCurrentOrder((prev) => (prev === order ? null : order));
  };

  return (
    <>
      <PageLayout
        header={<></>}
        footer={
          <>
            {error && (
              <div className={styles.footer}>
                {/* <div className={styles.error}>{JSON.stringify(error)}</div> */}
                <div className={styles.error}>
                  {(error as string[]).map((str) => t(str)).join('\n')}
                </div>
              </div>
            )}
          </>
        }
        sidebar={
          <OrdersFiltersForm initialFilters={currentFilters} onChange={handlerFiltersChange} />
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

export default OrdersEditScreen;
