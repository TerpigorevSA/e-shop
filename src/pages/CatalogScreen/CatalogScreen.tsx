import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'src/shared/ui/Loader/Loader';
import CatalogFiltersForm from './CatalogFiltersForm/CatalogFiltersForm';
import styles from './CatalogScreen.module.scss';
import { AppDispatch, RootState } from '../../app/store/store';
import { useGetCategoriesQuery } from '../../entities/Category/api/categoryApi';
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../entities/Product/api/productApi';
import ProductItem from '../../entities/Product/ui/ProductItem/ProductItem';
import { setQuantity } from '../../features/Cart/model/slice';
import useDataListController from '../../shared/hooks/useDataListController';
import {
  Category,
  MutateProductBody,
  Product,
  ProductsFilters,
} from '../../shared/types/serverTypes';
import ComponentFetchList from '../../shared/ui/ComponentFetchList/ComponentFetchList';
import PageLayout from '../../shared/ui/PageLayout/PageLayout';

const CatalogScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  // for categoties only
  const [categories, setCategories] = useState<Category[]>([]);
  const firstCategoryRender = useRef(true);
  const {
    data: categoryResponseData,
    isFetching: isFetchingCategories,
    isSuccess: isSuccessCategories,
  } = useGetCategoriesQuery(
    {},
    {
      // POSSIBLE WRONG
      skip: !firstCategoryRender.current,
    },
  );

  const categoryData = categoryResponseData?.data;
  const categoryServerPagination = categoryResponseData?.pagination;

  useEffect(() => {
    if (
      categoryData &&
      !isFetchingCategories &&
      (categoryServerPagination?.pageNumber !== 1 || firstCategoryRender.current)
    ) {
      setCategories((prev) => [...prev, ...categoryData]);
      firstCategoryRender.current = false;
    }
  }, [categoryData, categoryServerPagination, isFetchingCategories]);
  // for categoties only

  const { items, currentFilters, handlerFiltersChange, handlerFetchItems, error } =
    useDataListController<Product, ProductsFilters, MutateProductBody>(
      useGetProductsQuery,
      useUpdateProductMutation,
      useCreateProductMutation,
    );

  const currentCart = useSelector((state: RootState) => state.cart.currentCartEntries);

  const handleSetQuantity = useCallback(
    (product: Product, quantity: number) => {
      dispatch(setQuantity({ product, quantity }));
    },
    [dispatch],
  );

  const renderCallback = useCallback(
    (item: Product) => (
      <div className={cn(styles.item)} key={item.id}>
        <ProductItem
          name={item.name}
          desc={item.desc}
          price={item.price}
          photo={item.photo}
          count={currentCart.find(({ product }) => product.id === item.id)?.quantity ?? 0}
          onCountChange={(count) => handleSetQuantity(item, count)}
        />
      </div>
    ),
    [currentCart, handleSetQuantity],
  );

  return (
    <PageLayout
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
      header={<></>}
      sidebar={
        isSuccessCategories ? (
          <>
            <CatalogFiltersForm
              initialFilters={currentFilters}
              onChange={handlerFiltersChange}
              categories={categories}
            />
          </>
        ) : (
          <Loader />
        )
      }
    >
      <div className={cn(styles.list)}>
        <ComponentFetchList
          items={items}
          doFetch={handlerFetchItems}
          render={renderCallback}
          oneObserve={true}
        />
      </div>
    </PageLayout>
  );
};

export default CatalogScreen;
