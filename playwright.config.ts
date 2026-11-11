import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 2,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // Hiển thị tiến độ và kết quả trên Terminal/Console
    ['allure-playwright', { outputFolder: 'allure-results' }] // Xuất dữ liệu cho Allure
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://live.techpanda.org/index.php/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //screenshot: 'on',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */

  projects: [

    //BƯỚC A: Định nghĩa project Setup (chạy đầu tiên)
    {
      name: 'auth-ui',
      testMatch: '**/auth-ui.setup.ts'
    },

    // 1. Dự án chạy Setup bằng API (Chạy ngầm, siêu nhanh)
    {
      name: 'auth-api',
      testMatch: '**/auth-api.setup.ts', // Chỉ hướng vào file setup API mới viết
    },

    // 2. Dự án chạy E2E UI trên Chrome (Hưởng sái cookie từ file user.json do API tạo ra)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--disable-features=InsecureFormWarnings', // Thuốc giải của Chrome
            '--unsafely-treat-insecure-origin-as-secure=http://live.techpanda.org',
            '--disable-web-security']
        },
      },
      dependencies: ['auth-ui'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json', // Hưởng cookie từ bước setup giống Chrome

        ignoreHTTPSErrors: true, // Vượt rào https
        launchOptions: {
          firefoxUserPrefs: {
            'security.warn_submit_secure_to_insecure': false,
            'security.warn_submit_insecure': false,
            // Tắt cảnh báo màu đỏ dưới ô nhập password
            'security.insecure_field_warning.contextual.enabled': false,
            'dom.security.https_only_mode': false, // Tắt HTTPS-Only Mode nếu đang bật
            // Tắt WebRender phần cứng để Firefox chạy ổn định tuyệt đối trên Windows khi chạy đa luồng
            'layers.acceleration.disabled': true,
            'gfx.webrender.all': false,
          },
        },
      },
       dependencies: ['auth-ui'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json', // Hưởng cookie từ bước setup giống Chrome
        ignoreHTTPSErrors: true,                    // Bỏ qua lỗi SSL/HTTPS nếu có
      },
      dependencies: ['auth-ui'], // Chờ auth-ui chạy xong trước rồi mới chạy test WebKit
    },
  ]

  /*projects: isCI // Chạy CI CD Trên GithuB chỉ chạy Chrome
  ?[
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] ,       
        launchOptions: {
        args: [
          '--disable-features=InsecureFormWarnings',
        ],
      },  
          },
    },
  ]
   :[ {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] ,
      ignoreHTTPSErrors: true,
      launchOptions: {
        firefoxUserPrefs: {
          'security.warn_submit_secure_to_insecure': false,
          'security.warn_submit_insecure': false,
        },
      },},
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },
  //],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

// Đoạn khai báo ko dùng CI/CD
/*
projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-features=InsecureFormWarnings'],
        },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        ignoreHTTPSErrors: true, // Vượt rào https
        launchOptions: {
          firefoxUserPrefs: {
            'security.warn_submit_secure_to_insecure': false,
            'security.warn_submit_insecure': false,
          },
        },
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ]*/