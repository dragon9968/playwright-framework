import { test as setup, expect } from '@playwright/test';
import fs from 'fs'; // 1. Import thêm thư viện xử lý file của Node.js

// Đường dẫn nơi sẽ lưu file "vé thông hành"
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // --------------------------------------------------------
  // BƯỚC 0: XÓA FILE CŨ (NẾU CÓ) ĐỂ ĐẢM BẢO SẠCH SẼ 100%
  // --------------------------------------------------------
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile); // Lệnh xóa file
    console.log('🧹 Đã xóa file vé thông hành cũ!');
  }
  // 1. Đi tới trang Login của Techpanda
  await page.goto('http://live.techpanda.org/index.php/customer/account/login/');

  // 2. Thực hiện đăng nhập (Anh có thể dùng Page Object ở đây cho sạch)
  await page.getByTitle('Email Address').fill('anh_tester_pro@gmail.com');
  await page.getByTitle('Password').fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();

  // 3. Kiểm tra xem đã Login thành công chưa (phải vào tới Dashboard)
  await expect(page).toHaveURL(/.*customer\/account/);

  await expect(page.locator('.welcome-msg').first()).toContainText('Anh Tester!', { ignoreCase: true });

  // 4. LẤY TOÀN BỘ COOKIES & SESSION LƯU VÀO FILE JSON
  await page.context().storageState({ path: authFile });
});