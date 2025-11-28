import { expect } from '@playwright/test';
import { test } from '../base/BaseTest'; // Đảm bảo đường dẫn chính xác
import fs from 'fs';
import path from 'path';
import { allure } from 'allure-playwright';

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