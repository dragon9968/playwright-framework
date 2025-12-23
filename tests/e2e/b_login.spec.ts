import { expect } from '@playwright/test';
import { test } from '../base/BaseTest'; // Đảm bảo đường dẫn chính xác
import fs from 'fs';
import path from 'path';
import { delay } from "../ultility/utils";
import { allure } from 'allure-playwright';
import loginData from "../data/user_login_invalid.json";
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
  test.beforeEach(async ({ page ,loginPage,  env }) => {
      await loginPage.goTo(env.baseURL);
  });

   test("CASE 1 – TẤT CẢ FIELD TRỐNG", async ({ homePage, loginPage }) => {
     await homePage.click_Menu_Account_Link();
     await delay();
     await homePage.click_Login_Link();
     await delay();
     await loginPage.clickLoginButton();
     await delay();

     const emailError = await loginPage.getFieldError("email");
     const passwordError = await loginPage.getFieldError("pass");

     expect(emailError).toBe(loginData.required_error);
     expect(passwordError).toBe(loginData.required_error);
     await delay();
  });

   test("CASE 2 – EMAIL SAI FORMAT_1", async ({ homePage, loginPage }) => {
    await homePage.click_Menu_Account_Link();
    await delay();
    await homePage.click_Login_Link();
    await delay();
    await loginPage.enterEmail(loginData.invalid_email_case1);
    await delay();
    await loginPage.enterPassword(loginData.valid_password);
    await delay();
    await loginPage.clickLoginButton();

    const error = await loginPage.getEmailToastError();
    console.log("Giá trị thực tế lấy được:", error);
    console.log("Giá trị mong đợi trong data:", loginData.email_toast_error_case1);
    expect(error).toBe(loginData.email_toast_error_case1);
    await delay();
  });


  test("CASE 3 – EMAIL SAI FORMAT_2", async ({ homePage, loginPage }) => {
    await homePage.click_Menu_Account_Link();
    await delay();
    await homePage.click_Login_Link();
    await delay();
    await loginPage.enterEmail(loginData.invalid_email_case2);
    await delay();
    await loginPage.enterPassword(loginData.valid_password);
    await delay();
    await loginPage.clickLoginButton();

    const error = await loginPage.getEmailToastError();
    console.log("Giá trị thực tế lấy được:", error);
    console.log("Giá trị mong đợi trong data:", loginData.email_toast_error_case2);
    expect(error).toBe(loginData.email_toast_error_case2);
    await delay();
  });

  test("CASE 4 – EMAIL SAI FORMAT_3", async ({ homePage, loginPage }) => {
    await homePage.click_Menu_Account_Link();
    await delay();
    await homePage.click_Login_Link();
    await delay();
    await loginPage.enterEmail(loginData.invalid_email_case3);
    await delay();
    await loginPage.enterPassword(loginData.valid_password);
    await delay();
    await loginPage.clickLoginButton();

    const error = await loginPage.getEmailFormatError();
    console.log("Giá trị thực tế lấy được:", error);
    console.log("Giá trị mong đợi trong data:", loginData.email_format_error_case3);
    expect(error).toBe(loginData.email_format_error_case3);
    await delay();
  });


   test("CASE 5 – EMAIL KHÔNG TỒN TẠI", async ({ homePage, loginPage }) => {
    await homePage.click_Menu_Account_Link();
    await delay();
    await homePage.click_Login_Link();
    await delay();
    await loginPage.login(loginData.wrong_email, loginData.wrong_password);

    const message = await loginPage.getLoginFailedMessage();
    expect(message).toBe(loginData.login_failed_message);
    await delay();
  });



/*
   test('Login successfully with valid credentials: ', async ({page, loginPage, homePage, registerPage, testUser, env }) => {
    await allure.step('Đi tới trang login', async () => {
    //await loginPage.navigateLoginPage();
    //await loginPage.navigateTo(envConfig.baseURL);
    await loginPage.navigateTo(env.baseURL);
    });


    await allure.step('Bấm vào Menu Account', async () => {
    await homePage.click_Menu_Account_Link();
    });

    await loginPage.step('Bấm vào nút Login', async () => {
    await homePage.click_Login_Link();
    });

    await loginPage.step('Nhập vào email và password', async () => {
    // await loginPage.login("long1@qa.team","123456");
    await loginPage.login(email, password);
    });

    await allure.step('Xác minh hệ thống chuyển hướng vào trang DashBoard', async () => {
    // Giả sử sau login chuyển hướng về trang dashboard
    await loginPage.verifyLoginSuccess(); 
    });

   });

  /*test('Login failed with invalid credentials', async ({ loginPage, homePage }) => {
   await loginPage.navigateLoginPage();
    await homePage.click_Menu_Account_Link();
    await homePage.click_Login_Link();
    await loginPage.login("long111@qa.team","123456");
    //const errorMsg = await loginPage.page.locator('.error').textContent();
    //expect(errorMsg).toContain('Invalid credentials');
  });*/

});