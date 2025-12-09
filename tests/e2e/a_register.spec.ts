import { expect } from '@playwright/test';
import { RegisterPage } from '../pageObject/RegisterPage';
import { HomePage } from '../pageObject/HomePage';

import { BasePage } from '../base/BasePage';
import testData from '../data/user_register.json';
import { test } from '../base/BaseTest'; // Đảm bảo đường dẫn chính xác
import fs from 'fs';
import path from 'path';
import { allure } from 'allure-playwright';


const generateRandomEmail = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10); // Random alphanumeric string
  return `long_${randomString}@qa.team`;
};

/* Khai báo trong fixtures để dùng chung rồi thì ko cần khai báo trong test case nữa
const env = process.env.ENV || 'dev';
  const envConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../environments/${env}.json`), 'utf8')
  );*/

test.beforeEach(async ({ page , registerPage, homePage,  env }) => {
      await registerPage.goTo(env.baseURL);
  });

test('Open Page', async ({ page, env }) => {
  //await page.goto(envConfig.baseURL);
  await page.goto(env.baseURL);
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home page/);
});

// ❌ CASE 1 – TẤT CẢ FIELD ĐỂ TRỐNG
  test("Register fail: all fields empty", async ({ registerPage, homePage, env }) => {
    await homePage.click_Menu_Account_Link();
    await homePage.click_Register_Link();
    await registerPage.clickRegisterButton();

    //const error = await registerPage.getFieldError("firstname");
    expect(await registerPage.getFieldError("firstname")).toBe(testData.register_error_message);
    expect(await registerPage.getFieldError("lastname")).toBe(testData.register_error_message);
    expect(await registerPage.getFieldError("email_address")).toBe(testData.register_error_message);
    expect(await registerPage.getFieldError("password")).toBe(testData.register_error_message);
    expect(await registerPage.getFieldError("confirmation")).toBe(testData.register_error_message);

  });

// ❌ CASE 2 – EMAIL INVALID
  test("Register fail: invalid email format", async ({ registerPage, homePage, page }) => {
    await homePage.click_Menu_Account_Link();
    await homePage.click_Register_Link();
    await registerPage.enterFirstname(testData.firstname);
    await registerPage.enterMiddlename(testData.middlename);
    await registerPage.enterLastname(testData.lastname);
    await registerPage.enterEmail(testData.invalid_email);
    await registerPage.enterPassword(testData.password);
    await registerPage.enterConfirmPassword(testData.confirm_password);
    await registerPage.clickRegisterButton();
    /*const validationMessage = await page.locator("#email_address")
    .evaluate((el: any) => el.validationMessage);
     expect(validationMessage).toBe(testData.email_toast_error_message);*/
    const msg = await registerPage.getEmailValidationMessage();
    expect(msg).toBe(testData.email_toast_error_message);
  });


// ❌ CASE 3 – PASSWORD < 6 KÝ TỰ
   test("Register unsuccessfully when password is less than 6 characters", async ({ registerPage, homePage, page }) => {
    await homePage.click_Menu_Account_Link();
    await homePage.click_Register_Link();
    await registerPage.enterFirstname(testData.firstname);
    await registerPage.enterMiddlename(testData.middlename);
    await registerPage.enterLastname(testData.lastname);
    await registerPage.enterEmail(testData.valid_email);
    await registerPage.enterPassword(testData.short_password);
    await registerPage.enterConfirmPassword(testData.short_password);
    await registerPage.clickRegisterButton();
  const error = await registerPage.getMinLengthPasswordError();
  expect(error).toBe(testData.password_min_length_error);
});


// ❌ CASE 4 – PASSWORD & CONFIRM PASSWORD KHÔNG TRÙNG
   test("Register unsuccessfully when password and confirm password do not match", async ({ registerPage, homePage, page }) => {
    await homePage.click_Menu_Account_Link();
    await homePage.click_Register_Link();
    
    await registerPage.enterFirstname(testData.firstname);
    await registerPage.enterMiddlename(testData.middlename);
    await registerPage.enterLastname(testData.lastname);
    await registerPage.enterEmail(testData.valid_email);
    await registerPage.enterPassword(testData.short_password);
    await registerPage.enterConfirmPassword(testData.non_password);
    await registerPage.clickRegisterButton();
  const error = await registerPage.getPasswordMismatchError();
  expect(error).toBe(testData.password_not_match_error);
});


// ❌ CASE 5 – REGISTER SUCCESSFULLY
test('Register successfully with valid credentials', async ({ page, registerPage, homePage, testUser, env }) => {
  //await page.goto('/');
  //const bagePage = new BasePage(page)
  //khai báo ở fixtures.ts thì ko cần khởi tạo ở đây nữa
 // const registerPage = new RegisterPage(page);
  const randomEmail = generateRandomEmail();
  const password = testData.password;
  const confirm_password = testData.confirm_password;
  //await bagePage.navigateTo('/');
  await allure.step('Đi tới trang register', async () => {
  //await registerPage.goTo(envConfig.baseURL);
  await registerPage.goTo(env.baseURL);
  //await registerPage.navigateToRegisterPage();
  });

  //await page.getByRole('link', { name: 'Account', exact: true }). click();
  //await page.getByRole('link', { name: 'Register' }). click();

  await allure.step('Bấm vào Menu Account', async () => {
  await homePage.click_Menu_Account_Link();
  });

  await allure.step('Bấm vào nút Register', async () => {
  await homePage.click_Register_Link();
  });

/*   await page.fill('input#firstname','long');
  await page.fill('input#middlename','long');
  await page.fill('input#lastname','long');
  await page.fill('input[id="email_address"]',randomEmail);
  await page.fill('input#password','123456');
  await page.fill('input#confirmation','123456');
  await page.check('input#is_subscribed');
  await page.getByRole('button', { name: 'Register' }). click(); */
  //await registerPage.register('long','dinh','nguyen',randomEmail,'123456','123456');

  await allure.step('Nhập các thông tin hợp lê vào form đăng kí', async () => {
  await registerPage.register(testData.firstname, testData.middlename, testData.lastname,randomEmail, password, confirm_password);
  //await registerPage.register(testData.firstname, testData.middlename, testData.lastname,testUser.email, testUser.password,testUser.password);
  });

  fs.writeFileSync('tests/data/user_login.json', JSON.stringify({ randomEmail, password }, null, 2));

  // Expects page to have a heading with the name of Installation.
  await allure.step('Xác minh hệ thống chuyển hướng vào trang My DashBoard', async () => {
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
  await expect(page.getByText('Thank you for registering')).toHaveText('Thank you for registering with Main Website Store.');
      });
});
