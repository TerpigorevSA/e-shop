import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import { useTranslation } from 'react-i18next';
import { Loader } from 'src/shared/ui/Loader/Loader';
import styles from './ProductsEditScreen.module.scss';
import ProductsFiltersForm from './ProductsFiltersForm/ProductsFiltersForm';
import { useGetCategoriesQuery } from '../../entities/Category/api/categoryApi';
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../entities/Product/api/productApi';
import ProductItem from '../../entities/Product/ui/ProductItem/ProductItem';
import ProductEditForm from '../../features/forms/ProductEditForm/ProductEditForm';
import withEditMode from '../../shared/hocs/withEditMode';
import useDataListController from '../../shared/hooks/useDataListController';
import {
  Category,
  MutateProductBody,
  Product,
  ProductsFilters,
} from '../../shared/types/serverTypes';
import Button from '../../shared/ui/Button/Button';
import ComponentFetchList from '../../shared/ui/ComponentFetchList/ComponentFetchList';
import Modal from '../../shared/ui/Modal/Modal';
import PageLayout from '../../shared/ui/PageLayout/PageLayout';

const EditProductItem = withEditMode(ProductItem);

const ProductsEditScreen: React.FC = () => {
  const { t } = useTranslation();

  const [defaultItem] = useState<Product>({
    id: null,
    category: null, //categories[0],
    name: '',
    price: 0,
  } as unknown as Product);

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
      //POSSIBLE WRONG
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

  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    setCategoryNames(categories.map((category) => category.name));
  }, [categories]);
  // for categoties only

  const {
    items,
    currentFilters,
    handlerFiltersChange,
    handlerFetchItems,
    isLoading,
    error,
    editingItem,
    handlerEditItem,
    handlerAddClick,
    handlerEditClick,
    clearEditItem,
  } = useDataListController<Product, ProductsFilters, MutateProductBody>(
    useGetProductsQuery,
    useUpdateProductMutation,
    useCreateProductMutation,
  );

  const renderCallback = useCallback(
    (item: Product) => (
      <div className={cn(styles.item)} key={item.id}>
        <EditProductItem
          name={item.name}
          desc={item.desc}
          price={item.price}
          photo={item.photo}
          withButton={false}
          onEdit={() => handlerEditClick(item)}
        />
      </div>
    ),
    [],
  );

  return (
    <>
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
        header={
          <>
            <Button
              className={styles.addButton}
              lable="Add product"
              onClick={() => handlerAddClick(defaultItem)}
              disabled={isLoading}
            />
          </>
        }
        sidebar={
          isSuccessCategories ? (
            <>
              <ProductsFiltersForm
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
      {editingItem && (
        <Modal
          setVisible={(visible) => (visible ? null : clearEditItem())}
          visible={editingItem !== null}
        >
          <ProductEditForm
            defaultValues={{
              name: editingItem.name,
              price: editingItem.price,
              description: editingItem.desc,
              category: editingItem.category?.name,
              oldPrice: editingItem.oldPrice,
              photo: editingItem.photo ? { url: editingItem.photo } : undefined,
            }}
            categories={categoryNames}
            onSubmit={(data) => {
              const categoryId =
                categories?.find((category) => category.name === data.category)?.id ?? '';
              const { category: _category, description: desc, photo, ...rest } = data;
              void _category;
              handlerEditItem(editingItem.id, {
                ...rest,
                desc,
                categoryId,
                photo: photo?.url,
              });
              clearEditItem();
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductsEditScreen;
