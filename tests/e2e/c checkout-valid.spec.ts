import { expect } from '@playwright/test';
import { test } from '../base/BaseTest'; // Đảm bảo đường dẫn chính xác
import fs from 'fs';
import path from 'path';
import { delay } from "../ultility/utils";
import { checkoutData } from "../data/checkout.data";

test("Guest Checkout flow – success", async ({
  homePage,
  productPage,
  cartPage,
  checkoutPage,
}) => {

  await test.step("Open Mobile Category", async () => {
    await delay();
    await homePage.openCategoryMobile();
  });

  await test.step("Open first product", async () => {
    await delay();
    await homePage.openFirstProduct();
  });

  await test.step("Add product to cart", async () => {
    await delay();
    await productPage.addToCart();
    await delay();
  //  await productPage.openCart();
  })

  await test.step("Proceed to checkout", async () => {
    await delay();
    await cartPage.proceedToCheckout();
     // 👇 BYPASS NGAY ĐÂY
  await checkoutPage.bypassInsecureFormIfPresent();
  });

  await test.step("Checkout as guest", async () => {
    await delay();
    await checkoutPage.checkoutAsGuest();
  });

  await test.step("Fill billing information", async () => {
    await delay();
    await checkoutPage.fillBillingInformation(checkoutData);
  });

  await test.step("Select shipping method", async () => {
    await delay();
    await checkoutPage.selectShippingMethod();
  });

  await test.step("Select payment & place order", async () => {
    await delay();
    await checkoutPage.selectPaymentMethod();
    await delay();
    await checkoutPage.placeOrder();
  });

  await test.step("Verify order success", async () => {
    const msg = await checkoutPage.getSuccessMessage();
    expect(msg).toContain("Thank you for your purchase");
  });

});