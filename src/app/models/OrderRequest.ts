export interface OrderRequest {
    totalQuantity: number;
    totalPrice: number;
    discount: number;
    discountPrice: number;
    totalPayableAmount: number;
    cartIds: number[];
  }