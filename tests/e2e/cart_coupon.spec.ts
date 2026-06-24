import { test, } from '../base/BaseTest';

import { expect } from '@playwright/test';

test.describe('Cart & Coupon Code Feature', () => {
   
    test.beforeEach(async ({ mobilePage }) => {
        await mobilePage.goToMobilePage();
    });

    test('TC_05: Verify Discount Coupon works correctly', async ({ mobilePage, cartPage }) => {
        
     
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();

        // Kiểm tra text thông báo thêm vào giỏ hàng thành công
        const successMsg = await cartPage.getSuccessMessage();
        expect(successMsg).toContain('Sony Xperia was added to your shopping cart.');

        // Step 3: Enter Coupon code
        await cartPage.enterCouponCode('GURU50');
        await cartPage.clickApplyCoupon();

        // Step 4: Verify the discount generated
        const discountAmount = await cartPage.getDiscountAmountMessage();
        const grandTotal = await cartPage.getGrandTotal();

        // Khớp chính xác data mong đợi từ file Excel của anh
        expect(discountAmount).toBe('-$5.00');
        expect(grandTotal).toBe('$95.00');
    });
});