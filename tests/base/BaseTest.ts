import { test as base, expect, Page, BrowserContext} from '@playwright/test';
import { RegisterPage } from '../pageObject/RegisterPage';
import { HomePage } from '../pageObject/HomePage';
import { LoginPage } from '../pageObject/LoginPage';
import fs from 'fs';
import path from 'path';
import { allure } from 'allure-playwright';

export type EnvConfig = {
  baseURL: string;
  defaultUser: { email: string; password: string };
};

type MyFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    testUser: { email: string; password: string };
    env: EnvConfig;
  };

  const readEnvFile = (envName: string): EnvConfig => {
  const p = path.join(__dirname, `../environments/${envName}.json`);
  if (!fs.existsSync(p)) throw new Error(`Env file not found: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8')) as EnvConfig;
};

// Auto login function
  autoLogin: async ({ page, env }, use) => {
    const autoLoginFn = async () => {
      await page.goto(env.baseURL);
      const loginPage = new LoginPage(page);
      await loginPage.enterEmail(env.default_email);
      await loginPage.enterPassword(env.default_password);
      await loginPage.clickLoginButton();
    };

    await use(autoLoginFn);
  }

  export const test = base.extend<MyFixtures>({
  // env fixture: load environments/<env>.json
    env: async ({}, use) => {
    const envName = process.env.ENV || 'dev';
    const cfg = readEnvFile(envName);
    await use(cfg);
  },

    homePage: async ({ page }, use) => {
      const homePage = new HomePage(page);
      await use(homePage);
    },
    registerPage: async ({ page }, use) => {
      const registerPage = new RegisterPage(page);
      await use(registerPage);
    },
    loginPage: async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await use(loginPage);
    },
    // Tạo user động (email random)
  testUser: async ({}, use) => {
    const random = Math.floor(Math.random() * 100000);
    const email = `autouser_${random}@testmail.com`;
    const password = 'Password123!';
    await use({ email, password });
  },

  });

  /*// Auto attach screenshot khi FAIL
  test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const ss = await page.screenshot({ fullPage: true });
      await allure.attachment('screenshot', ss, 'image/png');
    } catch (e) {}
    // video & trace are handled by reporter/playwright config
  }
})*/;

  //export { expect } from '@playwright/test'; // nếu export cái này ở fixture thì ở file test case ko cần import lại cái này nữa
