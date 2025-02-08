import React from 'react';
import { useSelector } from 'react-redux';
import style from './CartIndicator.module.scss';
import { RootState } from '../../../../app/store/store';
import cartFilledIco from '../../../../shared/assets/shopping_cart_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';

const CartIndicator: React.FC = () => {
  const productsInCart = useSelector(
    (state: RootState) => state.cart.currentCartEntries?.length ?? 0,
  );

  return (
    <div className={style.wrapper}>
      <img src={cartFilledIco} alt="cart" className={style.image} />
      {productsInCart > 0 && <span className={style.badge}>{productsInCart}</span>}
    </div>
  );
};

export default CartIndicator;
