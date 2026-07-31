import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { CartPageUI } from '../pageUI/CartPageUI';

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async getSuccessMessage(): Promise<string | null> {
        return await this.page.locator(CartPageUI.SUCCESS_MESSAGE).innerText();
    }

    async enterCouponCode(couponCode: string) {
        await this.page.locator(CartPageUI.COUPON_INPUT).fill(couponCode);
    }

    async clickApplyCoupon() {
        await this.page.locator(CartPageUI.APPLY_COUPON_BUTTON).click();
    }

    async getDiscountAmountMessage(): Promise<string | null> {
        return await this.page.locator(CartPageUI.DISCOUNT_TEXT).innerText();
    }

    async getGrandTotal(): Promise<string | null> {
        return await this.page.locator(CartPageUI.GRAND_TOTAL_TEXT).innerText();
    }

    async enterQuantity(quantity: string) {
          const qtyInput = this.page.locator(CartPageUI.QTY_INPUT);
          // Step 1: Chủ động CLICK vào ô Qty trước để kích hoạt sự kiện HIỆN nút Update
          await qtyInput.click();
          // Step 2: Xóa sạch số lượng cũ
          await qtyInput.clear();
          // Step 3: Gõ số lượng mới vào 
          // (Dùng pressSequentially thay cho fill để giả lập gõ từng phím như người thật, kích hoạt mọi sự kiện của ô input)
          await qtyInput.pressSequentially(quantity);
    }

    async clickUpdate() {
        await this.page.locator(CartPageUI.UPDATE_BUTTON).click();
    }

    async getErrorMessage(): Promise<string | null> {
        return await this.page.locator(CartPageUI.ERROR_MESSAGE).innerText();
    }

    async getQuantityErrorMessage(): Promise<string | null> {
        return await this.page.locator(CartPageUI.ERROR_QRTY_MESSAGE).innerText();
    }
  
    async clickEmptyCart() {
        await this.page.locator(CartPageUI.EMPTY_CART_LINK).click();
    }

    async getEmptyCartMessage(): Promise<string | null> {
        return await this.page.locator(CartPageUI.EMPTY_CART_TEXT).innerText();
    }
}