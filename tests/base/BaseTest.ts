import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { RegisterPage } from '../pageObject/RegisterPage';
import { HomePage } from '../pageObject/HomePage';
import { LoginPage } from '../pageObject/LoginPage';
import { ProductPage } from '../pageObject/ProductPage';
import { CartPage } from '../pageObject/CartPage';
import { MobilePage } from '../pageObject/MobilePage';
import { MobilePage_getByRole } from '../pageObject/MobilePage_getByRole';
import fs from 'fs';
import path from 'path';

export type EnvConfig = {
  baseURL: string;
  defaultUser: { email: string; password: string };
};

type MyFixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  mobilePage: MobilePage;
  mobilePage_getByRole: MobilePage_getByRole;
  testUser: { email: string; password: string };
  env: EnvConfig;
  autoLogin: () => Promise<void>;
  bypassInsecureForm: void;
};

const readEnvFile = (envName: string): EnvConfig => {
  const p = path.join(__dirname, `../environments/${envName}.json`);
  if (!fs.existsSync(p)) throw new Error(`Env file not found: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8')) as EnvConfig;
};

export const test = base.extend<MyFixtures>({
  // 1. Tự động áp dụng cho tất cả test case mà không cần khai báo ở từng test
  bypassInsecureForm: [
    async ({ context }, use) => {
      const handler = async (page: Page) => {
        try {
          await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
          const sendAnywayBtn = page.getByRole('button', { name: 'Send anyway' });
          if (await sendAnywayBtn.isVisible()) {
            await sendAnywayBtn.click();
            await page.waitForLoadState('load');
          }
        } catch {
          // ignore
        }
      };

      context.on('page', handler);
      await use();
      context.off('page', handler);
    },
    { auto: true },
  ],

  // 2. Load cấu hình môi trường
  env: async ({}, use) => {
    const envName = process.env.ENV || 'dev';
    const cfg = readEnvFile(envName);
    await use(cfg);
  },

  // 3. Hàm auto login tiện ích
  autoLogin: async ({ page, env }, use) => {
    const autoLoginFn = async () => {
      await page.goto(env.baseURL);
      const loginPage = new LoginPage(page);
      await loginPage.enterEmail(env.defaultUser.email);
      await loginPage.enterPassword(env.defaultUser.password);
      await loginPage.clickLoginButton();
    };
    await use(autoLoginFn);
  },

  // 4. Các Page Object Fixtures
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  mobilePage: async ({ page }, use) => {
    await use(new MobilePage(page));
  },

  mobilePage_getByRole: async ({ page }, use) => {
    await use(new MobilePage_getByRole(page));
  },

  // 5. Fixture tạo user ngẫu nhiên
  testUser: async ({}, use) => {
    const random = Math.floor(Math.random() * 100000);
    const email = `autouser_${random}@testmail.com`;
    const password = 'Password123!';
    await use({ email, password });
  },
});

// Export expect để các file spec chỉ cần import từ BaseTest
export { expect } from '@playwright/test';

//Vì file .spec.ts không dùng được this.step(),
//  anh có thể tạo một hàm dùng chung logStep trong file tests/base/BaseTest.ts để bọc console.log + test.step lại làm một:
export async function logStep<T>(title: string, action: () => Promise<T>): Promise<T> {
  console.log(`\n=== [TEST STEP]: ${title} ===`);
  return await test.step(title, action);
}