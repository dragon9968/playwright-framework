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
}