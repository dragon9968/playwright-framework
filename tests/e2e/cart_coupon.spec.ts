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

    test('TC_06: Verify Error Message for Invalid Coupon Code', async ({ mobilePage, cartPage }) => {
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();

        // Step 3: Enter invalid Coupon code
        await cartPage.enterCouponCode('INVALID');
        await cartPage.clickApplyCoupon();

        // Step 4: Verify the error message
        const errorMsg = await cartPage.getErrorMessage();
        expect(errorMsg).toContain('The coupon code "INVALID" is not valid.');
    });

    test('TC_07: Verify Error Message for Invalid Quantity', async ({ mobilePage, cartPage }) => {
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();    
        // Step 3: Enter invalid quantity (e.g., 501) and click Update
        await cartPage.enterQuantity('501');
        await cartPage.clickUpdate();
        // Step 4: Verify the error message
        const errorQtyMsg = await cartPage.getQuantityErrorMessage();
        expect(errorQtyMsg).toContain('The maximum quantity allowed for purchase is 500.');

        const errorMsg = await cartPage.getErrorMessage();
        expect(errorMsg).toContain('Some of the products cannot be ordered in requested quantity.');
        
        // Step 5: Click on "Empty Cart" button
        await cartPage.clickEmptyCart();
        // Step 6: Verify the cart is empty
        const emptyCartMsg = await cartPage.getEmptyCartMessage();
        expect(emptyCartMsg).toContain('You have no items in your shopping cart.');
      
        
    });
});