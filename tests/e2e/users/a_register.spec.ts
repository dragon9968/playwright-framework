import { expect } from '@playwright/test';
import testData from '../../data/user_register.json';
import { test, logStep } from '../../base/BaseTest';
import fs from 'fs';
import { DataGenerator } from '../../helpers/DataGenerator';

// DÒNG BÙA CHÚ: Ép Playwright KHÔNG dùng "login session" cho riêng file này.
// Trình duyệt sẽ mở lên ở trạng thái trắng bóc (như ẩn danh).
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Register feature', () => {
  //test.describe.configure({ mode: 'parallel' });
  test.beforeEach(async ({ homePage, env }) => {
    await logStep('Pre-condition: Mở trang chủ và đi tới màn hình Register', async () => {
    await homePage.navigateTo(env.baseURL);
    await homePage.click_Menu_Account_Link();
    await homePage.click_Register_Link();
  });
  });

  test('CASE 1 – TẤT CẢ FIELD ĐỂ TRỐNG', async ({ registerPage, homePage }) => {
    await test.step('1.  Bấm nút Register khi để trống tất cả các trường', async () => {
      await registerPage.clickRegisterButton();
    });
    await test.step('2. Xác minh thông báo lỗi bắt buộc nhập ở cả 5 trường', async () => {
      const requiredFields = ['firstname', 'lastname', 'email_address', 'password', 'confirmation'];
      for (const field of requiredFields) {
        await registerPage.verifyFieldError(field, testData.register_error_message);
      }
    });
  });

  test('CASE 2 – EMAIL INVALID', async ({ registerPage, homePage, browserName }) => {
    await test.step('1. Nhập thông tin hợp lệ vào các field, riêng email nhập sai định dạng và bấm nút Register', async () => {
      await registerPage.enterFirstname(testData.firstname);
      await registerPage.enterMiddlename(testData.middlename);
      await registerPage.enterLastname(testData.lastname);
      await registerPage.enterEmail(testData.invalid_email);
      await registerPage.enterPassword(testData.password);
      await registerPage.enterConfirmPassword(testData.confirm_password);
      await registerPage.clickRegisterButton();
    });
    await test.step('2. Xác minh thông báo lỗi định dạng email hiển thị theo từng trình duyệt', async () => {
      await registerPage.verifyEmailValidationMessage(
        testData.email_toast_error_message[browserName]
      );
    });
  });

  test('CASE 3 – PASSWORD < 6 KÝ TỰ', async ({ registerPage, homePage }) => {
    await test.step('1. Nhập thông tin hợp lệ vào các field, nhập mật khẩu dưới 6 ký tự và bấm nút Register', async () => {
      await registerPage.enterFirstname(testData.firstname);
      await registerPage.enterMiddlename(testData.middlename);
      await registerPage.enterLastname(testData.lastname);
      await registerPage.enterEmail(testData.valid_email);
      await registerPage.enterPassword(testData.short_password);
      await registerPage.enterConfirmPassword(testData.short_password);
      await registerPage.clickRegisterButton();
    });
    await test.step('2. Xác minh thông báo lỗi độ dài mật khẩu tối thiểu', async () => {
      await registerPage.verifyMinLengthPasswordError(testData.password_min_length_error);
    });
  });

  test('CASE 4 – PASSWORD & CONFIRM PASSWORD KHÔNG TRÙNG', async ({ registerPage, homePage }) => {
    await test.step('1.Nhập thông tin hợp lệ vào các field,nhập mật khẩu xác nhận không khớp và bấm nút Register', async () => {
      await registerPage.enterFirstname(testData.firstname);
      await registerPage.enterMiddlename(testData.middlename);
      await registerPage.enterLastname(testData.lastname);
      await registerPage.enterEmail(testData.valid_email);
      await registerPage.enterPassword(testData.short_password);
      await registerPage.enterConfirmPassword(testData.non_password);
      await registerPage.clickRegisterButton();
    });
    await test.step('2. Xác minh thông báo lỗi mật khẩu không trùng khớp', async () => {
      await registerPage.verifyPasswordMismatchError(testData.password_not_match_error);
    });
  });

  test('CASE 5 – REGISTER SUCCESSFULLY', async ({ page, registerPage, homePage, testUser, env }) => {
    const randomEmail = DataGenerator.generateRandomEmail();
    const password = testData.password;
    const confirm_password = testData.confirm_password;
  
    await logStep('1. Nhập các thông tin hợp lê vào form đăng kí và bấm nút Register', async () => {
      await registerPage.register(
        testData.firstname, 
        testData.middlename, 
        testData.lastname, 
        randomEmail, 
        password,
        confirm_password);
    });
    await logStep('2. Xác minh hệ thống chuyển hướng vào trang My DashBoard', async () => {
      await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
      await expect(page.getByText('Thank you for registering')).toHaveText('Thank you for registering with Main Website Store.');
    });

     fs.writeFileSync('tests/data/user_login.json', JSON.stringify({ randomEmail, password }, null, 2));
  })
});