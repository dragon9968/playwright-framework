import { test, expect } from '../../base/BaseTest';

// Ép các test trong file này chạy tuần tự từng cái một (dùng chung 1 tài khoản session login)
test.describe.configure({ mode: 'serial' });

test.describe('Cart & Coupon Code Feature', () => {
    
    // Dọn sạch giỏ hàng SAU MỖI BÀI TEST (dù pass hay fail)
    test.afterEach(async ({ page }) => {
        // Nếu URL chưa phải giỏ hàng thì vào giỏ hàng
        if (!page.url().includes('/checkout/cart/')) {
            await page.goto('/checkout/cart/');
        }
        // Nếu thấy nút Empty Cart thì click dọn sạch
        const emptyCartBtn = page.getByRole('button', { name: 'Empty Cart' });
        if (await emptyCartBtn.isVisible()) {
            await emptyCartBtn.click();
            await page.waitForLoadState('domcontentloaded');
        }
    });
    
    // Trước mỗi bài test, luôn xuất phát từ trang Mobile
    test.beforeEach(async ({ mobilePage }) => {
        await mobilePage.goToMobilePage();
    });

    test('TC_05: Verify Discount Coupon works correctly', async ({ mobilePage, cartPage }) => {
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();

        // Kiểm tra text thông báo thêm vào giỏ hàng thành công
        const successMsg = await cartPage.getSuccessMessage();
        expect(successMsg).toContain('Sony Xperia was added to your shopping cart.');

        // Điền số lượng 1 và update lại
        await cartPage.enterQuantity('1');
        //await cartPage.clickUpdate();

        // Step 3: Enter Coupon code
        await cartPage.enterCouponCode('GURU50');
        await cartPage.clickApplyCoupon();

        // Step 4: Verify the discount generated
        const discountAmount = await cartPage.getDiscountAmountMessage();
        const grandTotal = await cartPage.getGrandTotal();
        console.log(`discountAmount: ${discountAmount}`);
        console.log(`grandTotal: ${grandTotal}`);

        // Khớp chính xác data mong đợi từ file Excel của anh
        expect(discountAmount).toBe('-$5.00');
        expect(grandTotal).toBe('$100.00');
    });

    test('TC_06: Verify Error Message for Invalid Coupon Code', async ({ mobilePage, cartPage }) => {
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();

        // Step 3: Enter invalid Coupon code
        await cartPage.enterCouponCode('INVALID');
        await cartPage.clickApplyCoupon();

        // Step 4: Verify the error message
        const errorMsg = await cartPage.getErrorMessage();
        expect(errorMsg).toContain('Coupon code "INVALID" is not valid.');
    });

    test('TC_07: Verify Error Message for Invalid Quantity', async ({ mobilePage, cartPage }) => {
        // Step 2: Click on 'Mobile' menu and add Sony Xperia to cart
        await mobilePage.clickAddToCartSonyXperia();
        
        // Step 3: Enter invalid quantity (e.g., 501) and click Update
        await cartPage.enterQuantity('501');
        //await cartPage.clickUpdate();
        
        // Step 4: Verify the error message
        const errorQtyMsg = await cartPage.getQuantityErrorMessage();
        expect(errorQtyMsg).toContain('The maximum quantity allowed for purchase is 500.');

        const errorMsg = await cartPage.getErrorMessage();
        expect(errorMsg).toContain('Some of the products cannot be ordered in requested quantity.');

        // -----------------------------------------------------
        // PHẦN TEST NGHIỆP VỤ EMPTY CART CỦA RIÊNG TC_07
        // (Vẫn giữ nguyên ở đây để test chức năng Empty Cart)
        // -----------------------------------------------------
        // Step 5: Click on "Empty Cart" button
        await cartPage.clickEmptyCart();
        
        // Step 6: Verify the cart is empty
        const emptyCartMsg = await cartPage.getEmptyCartMessage();
        expect(emptyCartMsg).toContain('You have no items in your shopping cart.');
    });
});
