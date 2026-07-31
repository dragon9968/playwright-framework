export const CartPageUI = {
  PROCEED_TO_CHECKOUT: "//ul[@class='checkout-types top']//button[@title='Proceed to Checkout']",
  SUCCESS_MESSAGE: 'li.success-msg span',
  ERROR_MESSAGE: 'li.error-msg span',  
  ERROR_QRTY_MESSAGE: 'p.item-msg',
  COUPON_INPUT: '#coupon_code',
  APPLY_COUPON_BUTTON: 'button[value="Apply"]',
  DISCOUNT_TEXT: 'tr:has-text("Discount (GURU50)") td:last-child span',
  GRAND_TOTAL_TEXT: 'tr:has-text("Grand Total") td:last-child span',
  QTY_INPUT: 'input[title="Qty"]',
  UPDATE_BUTTON: 'button[title="Update"]',
  EMPTY_CART_LINK: 'button[title="Empty Cart"]',
  // Lựa chọn 1 (Sử dụng :first-of-type - Chọn thẻ p đầu tiên)
  EMPTY_CART_TEXT : '.cart-empty p:first-of-type'

  // Hoặc Lựa chọn 2 (Sử dụng :has-text() - Chọn thẻ p chứa đoạn văn bản cụ thể)
  // EMPTY_CART_TEXT : '.cart-empty p:has-text("You have no items in your shopping cart.")';
};
