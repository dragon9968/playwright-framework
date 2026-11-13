import { expect } from '@playwright/test';
import { test, logStep } from '../../base/BaseTest'; // Đảm bảo đường dẫn chính xác
import fs from 'fs';
import { delay } from "../../ultility/utils";
import loginData from "../../data/user_login_invalid.json";

// DÒNG BÙA CHÚ: Ép Playwright KHÔNG dùng "login session" cho riêng file này.
// Trình duyệt sẽ mở lên ở trạng thái trắng bóc (như ẩn danh).
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login feature', () => {
  let email: string;
  let password: string;

  test.beforeAll(() => {
    const userFile = 'tests/data/user_login.json';
    if (!fs.existsSync(userFile)) {
      throw new Error('❌ Missing user.json – run register test first!');
    }

    const data = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
    email = data.randomEmail;
    password = data.password;
  });

  /* Khai báo trong fixtures để dùng chung rồi thì ko cần khai báo trong test case nữa
const env = process.env.ENV || 'dev';
  const envConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../environments/${env}.json`), 'utf8')
  );*/
  test.beforeEach(async ({ homePage, env }) => {
  await logStep('Pre-condition: Mở trang chủ và đi tới màn hình Login', async () => {
    await homePage.navigateTo(env.baseURL);
    await homePage.click_Menu_Account_Link();
    await homePage.click_Login_Link();
  });
});

  test('CASE 1 🔑 TẤT CẢ FIELD TRỐNG', async ({ homePage, loginPage }) => {
    await logStep('1. Bấm nút Login khi để trống tất cả các trường', async () => {
      await loginPage.clickLoginButton();
    });

    await logStep('2. Xác minh thông báo lỗi bắt buộc nhập ở cả Email và Password', async () => {
      await loginPage.verifyFieldError('email', loginData.required_error);
      await loginPage.verifyFieldError('pass', loginData.required_error);
    });
  });

  test('CASE 2 🔑 EMAIL SAI FORMAT_1 (Thiếu ký tự @)' , async ({ homePage, loginPage, browserName }) => {
    await logStep('1. Nhập email thiếu @ và bấm Login', async () => {
      await loginPage.enterEmail(loginData.invalid_email_case1);
      await loginPage.enterPassword(loginData.valid_password);
      await loginPage.clickLoginButton();
    });

    await logStep('2. Xác minh thông báo lỗi của trình duyệt tại ô Email', async () => {
      await loginPage.verifyEmailValidationMessage(
        loginData.email_toast_error_case1[browserName]
      );
    });
  });

  test('CASE 3 🔑 EMAIL SAI FORMAT_2 (Thiếu phần sau @)', async ({ homePage, loginPage, browserName }) => {
    await logStep('1. Nhập email thiếu phần sau @ và bấm Login', async () => {
      await loginPage.enterEmail(loginData.invalid_email_case2);
      await loginPage.enterPassword(loginData.valid_password);
      await loginPage.clickLoginButton();
    });

    await logStep('2. Xác minh thông báo lỗi của trình duyệt tại ô Email', async () => {
      await loginPage.verifyEmailValidationMessage(
        loginData.email_toast_error_case2[browserName]
      );
    });
  });

  test('CASE 4 🔑 EMAIL SAI FORMAT_3 (Sai định dạng domain)', async ({ homePage, loginPage }) => {
    await logStep('1. Nhập email sai định dạng domain và bấm Login', async () => {
      await loginPage.enterEmail(loginData.invalid_email_case3);
      await loginPage.enterPassword(loginData.valid_password);
      await loginPage.clickLoginButton();
    });

    await logStep('2. Xác minh thông báo lỗi định dạng Email hiển thị trên form', async () => {
      await loginPage.verifyEmailFormatError(loginData.email_format_error_case3);
    });
  });

  test('CASE 5 🔑 EMAIL KHÔNG TỒN TẠI', async ({ homePage, loginPage }) => {
    await logStep('1. Đăng nhập với email và mật khẩu không tồn tại', async () => {
      await loginPage.login(loginData.wrong_email, loginData.wrong_password);
    });

    await logStep('2. Xác minh thông báo đăng nhập thất bại', async () => {
      await loginPage.verifyLoginFailedMessage(loginData.login_failed_message);
    });
  });

  test('CASE 6 – LOGIN THÀNH CÔNG VỚI TÀI KHOẢN HỢP LỆ', async ({ page, loginPage, homePage, registerPage, testUser, env }) => {
    await logStep('1. Đăng nhập với tài khoản hợp lệ', async () => {
      await loginPage.login(email, password);
    });
    await logStep('2. Xác minh hệ thống chuyển hướng vào trang DashBoard', async () => {
      await loginPage.verifyLoginSuccess();
    });

  });
});