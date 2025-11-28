//BasePage → Page Object → Page UI → Fixtures → Tests
import { Page, Locator, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

type role = 
  | 'alert' | 'alertdialog'| 'application'| 'article'| 'banner'| 'button'| 'checkbox'| 'code'| 'combobox'| 'complementary'| 'dialog'| 'document'| 'form'| 'grid'| 'group'
  | 'heading'| 'link'| 'list'| 'listbox'| 'listitem'| 'main'| 'marquee'| 'menu'| 'menuitem'| 'menuitemcheckbox'| 'menuitemradio'| 'navigation'| 'note'| 'option'
  | 'presentation'| 'progressbar'| 'radio'| 'radiogroup'| 'region'| 'row'| 'rowgroup'| 'rowheader'| 'scrollbar'| 'search'| 'separator'| 'slider'| 'spinbutton'
  | 'status'| 'tab'| 'tabpanel'| 'textbox'| 'timer'| 'toolbar'| 'tooltip' | 'tree'| 'treeitem';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  
  
  // Hàm chụp screenshot ở từng step, nếu viết hàm riêng ở file auto-step.ts thì ko cần dùng ở đây nữa
  async step(message: string, action: () => Promise<void>) {
  await allure.step(message, async () => {
    try {
      await action();

      // Screenshot ALWAYS
      const img = await this.page.screenshot();
      await allure.attachment(`Screenshot - ${message}`, img, "image/png");

    } catch (error) {
      // Screenshot on FAIL
      const img = await this.page.screenshot();
      await allure.attachment(`Screenshot FAILED - ${message}`, img, "image/png");
      throw error;
    }
  });
}


  // ===== Hành động cơ bản =====
  getByRole(role: string, name: string): Locator {
    // Removed async keyword as this method doesn't need to await anything
    return this.page.getByRole(role as any, { name });
  }

  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async clickElement(selector: string) {
    //await this.page.click(selector);
    await this.page.locator(selector).click();
  }

  async clickElementByRole(role: string, name: string) {
    const locator = this.page.getByRole(role as any, { name });
    await locator.click();
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async fillInputByRole(role: string, name: string, value: string): Promise<void> {
    const locator = this.page.getByRole(role as any, { name });
    await locator.fill(value);
  }

  async press(selector: string, key: string) {
    await this.page.press(selector, key);
  }

  async hover(selector: string) {
    await this.page.hover(selector);
  }

  async check(selector: string) {
    await this.page.check(selector);
  }

  async uncheck(selector: string) {
    await this.page.uncheck(selector);
  }

  async select(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async upload(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath);
  }

  async getElementText(selector: string): Promise<string> {
    return (await this.page.textContent(selector)) || '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

   async getValue(selector: string) {
    return await this.page.inputValue(selector);
  }

  async count(selector: string) {
    return await this.page.locator(selector).count();
  }


  // ===== Expect / Assert =====
  async expectVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async expectText(selector: string, expected: string) {
    await expect(this.page.locator(selector)).toHaveText(expected);
  }

  async expectUrlContains(expected: string) {
    await expect(this.page).toHaveURL(new RegExp(expected));
  }

  async expectTitleContains(expected: string) {
    await expect(this.page).toHaveTitle(new RegExp(expected));
  }

  // ✅ Kiểm tra URL chứa một phần
  async expectURLContains(pathPart: string) {
    await expect(this.page).toHaveURL(new RegExp(pathPart));
  }

  // ✅ Kiểm tra URL khớp chính xác
  async expectExactURL(expectedURL: string) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  // ✅ (tùy chọn) Kiểm tra tiêu đề trang
  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

// ===== Điều hướng và xử lý trang =====

  async navigateTo(url: string) {
    await allure.step(`Đi đến: ${url}`, async () => {
    await this.page.goto(url);
        });
  }

  async goTo(url: string) {
    await allure.step(`Đi đến: ${url}`, async () => {
    await this.page.goto(url);
    });
  }

  async reload() {
    await this.page.reload();
  }

  async goBack() {
    await this.page.goBack();
  }

  async goForward() {
    await this.page.goForward();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  // ===== Screenshot / Debug =====
  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async pause() {
    await this.page.pause();
  }

  // ===== Tiện ích khác =====
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async getAttribute(selector: string, attr: string) {
    return await this.page.getAttribute(selector, attr);
  }
  
}
