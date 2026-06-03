import { test, expect } from '@playwright/test';

test('Check My Product in Cart', async ({ page }) => {
  // Vừa mở trang Dashboard là nó ĐÃ ĐĂNG NHẬP SẴN RỒI
  await page.goto('http://live.techpanda.org/index.php/customer/account/');

  // Kiểm tra tên người dùng hiển thị (chứng minh đã login thành công)
  const welcomeMsg = page.locator('.welcome-msg').first();
  await expect(welcomeMsg).toContainText('Anh Tester!', { ignoreCase: true });  
  // Tiếp tục test các tính năng Giỏ hàng, Thanh toán...
  await page.getByRole('link', { name: 'CART' }).click();
});