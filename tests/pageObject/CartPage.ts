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

    async enterQuantity(quantity: string): Promise<void> {
        const qtyInput = this.page.locator(CartPageUI.QTY_INPUT).first();
        await qtyInput.fill(quantity);
        await qtyInput.press('Enter'); // Tự submit form an toàn tuyệt đối
        await this.page.waitForLoadState('domcontentloaded');
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