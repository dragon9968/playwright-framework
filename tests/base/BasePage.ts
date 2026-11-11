import { Page, Locator, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// Định nghĩa sẵn các Role phổ biến để VS Code tự động gợi ý (IntelliSense)
type CustomAriaRole =
  | 'alert' | 'button' | 'checkbox' | 'combobox' | 'dialog' | 'heading'
  | 'link' | 'listbox' | 'menu' | 'menuitem' | 'option' | 'progressbar'
  | 'radio' | 'scrollbar' | 'search' | 'slider' | 'spinbutton'
  | 'status' | 'tab' | 'tabpanel' | 'textbox' | 'tooltip' | 'tree' | string;

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ==========================================
  // 1. ALLURE STEP WRAPPER (Tự động log & chụp ảnh)
  // ==========================================
  // tests/base/BasePage.ts
  async step<T>(message: string, action: () => Promise<T>): Promise<T> {
    let result: T;
    await allure.step(message, async () => {
      try {
        result = await action();
        const img = await this.page.screenshot();
        await allure.attachment(`Screenshot - ${message}`, img, "image/png");
      } catch (error) {
        // Chỉ chụp ảnh nếu trang vẫn còn mở (tránh lỗi khi bị timeout đóng browser)
        try {
          if (!this.page.isClosed()) {
            const img = await this.page.screenshot();
            await allure.attachment(`Error Screenshot - ${message}`, img, "image/png");
          }
        } catch {
          // Bỏ qua lỗi chụp ảnh khi browser đã bị kill
        }
        throw error;
      }
    });
    return result!;
  }

  // ==========================================
  // 2. TÌM KIẾM PHẦN TỬ (LOCATORS)
  // ==========================================
  getByRole(role: CustomAriaRole, name: string): Locator {
    return this.page.getByRole(role as any, { name });
  }

  // ==========================================
  // 3. HÀNH ĐỘNG CƠ BẢN (ACTIONS)
  // ==========================================
  async clickElement(selector: string, options?: { noWaitAfter?: boolean; force?: boolean; clickCount?: number }) {
    await this.page.locator(selector).click(options);
  }

  async dblClickElement(selector: string, options?: { force?: boolean }) {
    await this.page.locator(selector).dblclick(options);
  }

  async rightClickElement(selector: string, options?: { force?: boolean }) {
    await this.page.locator(selector).click({ ...options, button: 'right' });
  }

  async clickElementByRole(role: CustomAriaRole, name: string) {
    await this.page.getByRole(role as any, { name }).click();
  }

  async clickByJS(selector: string): Promise<void> {
    await this.page.locator(selector).evaluate((el: any) => {
      setTimeout(() => el.click(), 0);
    });
  }

  async fillInput(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  async fillInputByRole(role: CustomAriaRole, name: string, value: string) {
    await this.page.getByRole(role as any, { name }).fill(value);
  }

  // Thay thế cho hàm type() đã bị Playwright gạch bỏ (deprecated)
  // Gõ từng ký tự một với độ trễ (delay), rất tốt để test các ô Search có Auto-suggest
  async typeSequentially(selector: string, value: string, delayMs: number = 100) {
    await this.page.locator(selector).pressSequentially(value, { delay: delayMs });
  }

  async clearInput(selector: string) {
    await this.page.locator(selector).clear();
  }

  async press(selector: string, key: string) {
    await this.page.locator(selector).press(key);
  }

  async hover(selector: string, options?: { force?: boolean }) {
    await this.page.locator(selector).hover(options);
  }

  async focus(selector: string) {
    await this.page.locator(selector).focus();
  }

  async check(selector: string, options?: { force?: boolean }) {
    await this.page.locator(selector).check(options);
  }

  async uncheck(selector: string, options?: { force?: boolean }) {
    await this.page.locator(selector).uncheck(options);
  }

  async setChecked(selector: string, checkedState: boolean) {
    await this.page.locator(selector).setChecked(checkedState);
  }

  async selectOption(selector: string, value: string) {
    await this.page.locator(selector).selectOption(value);
  }

  async uploadFile(selector: string, filePath: string | string[]) {
    await this.page.locator(selector).setInputFiles(filePath);
  }

  async dragAndDrop(sourceSelector: string, targetSelector: string) {
    await this.page.locator(sourceSelector).dragTo(this.page.locator(targetSelector));
  }

  async scrollIntoView(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async dispatchEvent(selector: string, type: string) {
    await this.page.locator(selector).dispatchEvent(type);
  }

  // ==========================================
  // 4. LẤY TRẠNG THÁI & DỮ LIỆU (GETTERS)
  // ==========================================
  async getElementText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent())?.trim() || '';
  }

  async getAllInnerTexts(selector: string, stepMessage?: string): Promise<string[]> {
    const action = async () => {
      const elements = this.page.locator(selector);
      const texts = await elements.allInnerTexts();
      return texts.map(text => text.trim());
    };

    if (stepMessage) {
      return await this.step(stepMessage, action);
    }
    return await action();
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  async getAttribute(selector: string, attr: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attr);
  }

  async getCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // CHUẨN MỚI: Dùng locator().isVisible() thay vì page.isVisible()
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isEnabled();
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isChecked();
  }

  // ==========================================
  // 5. CƠ CHẾ ĐỒNG BỘ CHỜ ĐỢI (WAITING STRATEGIES)
  // ==========================================
  async waitForElementVisible(selector: string, timeout?: number) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(selector: string, timeout?: number) {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  async waitForElementAttached(selector: string, timeout?: number) {
    await this.page.locator(selector).waitFor({ state: 'attached', timeout });
  }

  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load') {
    await this.page.waitForLoadState(state);
  }

  async wait(ms: number = 1000) {
    // Chỉ dùng khi thực sự cần thiết, hạn chế tối đa Hard Sleep
    await this.page.waitForTimeout(ms);
  }

  // ==========================================
  // 6. EXPECTATIONS / ASSERTIONS (WEB-FIRST)
  // ==========================================
  async expectVisible(selector: string, timeout?: number) {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  async expectHidden(selector: string, timeout?: number) {
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  async expectText(selector: string, expectedText: string) {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  async expectContainsText(selector: string, expectedText: string) {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  async expectValue(selector: string, expectedValue: string) {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }

  async expectAttribute(selector: string, attr: string, expectedValue: string | RegExp) {
    await expect(this.page.locator(selector)).toHaveAttribute(attr, expectedValue);
  }

  async expectCount(selector: string, expectedCount: number) {
    await expect(this.page.locator(selector)).toHaveCount(expectedCount);
  }

  async expectEnabled(selector: string) {
    await expect(this.page.locator(selector)).toBeEnabled();
  }

  async expectDisabled(selector: string) {
    await expect(this.page.locator(selector)).toBeDisabled();
  }

  async expectChecked(selector: string, state: boolean = true) {
    await expect(this.page.locator(selector)).toBeChecked({ checked: state });
  }

  async expectEmpty(selector: string) {
    await expect(this.page.locator(selector)).toBeEmpty();
  }

  async expectExactURL(expectedURL: string) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async expectURLContains(pathPart: string) {
    await expect(this.page).toHaveURL(new RegExp(pathPart));
  }

  async expectTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  // ==========================================
  // 7. ĐIỀU HƯỚNG & XỬ LÝ TRANG (NAVIGATION & DIALOGS)
  // ==========================================
  async navigateTo(url: string) {
    await allure.step(`Đi tới trang: ${url}`, async () => {
      await this.page.goto(url);
    });
  }

  async reload() {
    await this.page.reload();
  }

  async goBack() {
    await this.page.goBack();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  // Xử lý Alert / Confirm dialog (Cần gọi trước hàm click gây ra dialog)
  async acceptNextDialog(promptText?: string) {
    this.page.once('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept(promptText);
    });
  }

  async dismissNextDialog() {
    this.page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  // ==========================================
  // 8. TIỆN ÍCH DỰ ÁN (PROJECT UTILITIES)
  // ==========================================
  async getValidationMessage(selector: string): Promise<string> {
    const locator = this.page.locator(selector);
    return await locator.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async bypassInsecureFormIfPresent() {
    const sendAnywayBtn = this.page.getByRole('button', { name: 'Send anyway' });
    if (await sendAnywayBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('⚠ Detected insecure form, clicking Send anyway');
      await sendAnywayBtn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async handleHtmlWarningPopup(popupSelector: string, acceptBtnSelector: string) {
    const popup = this.page.locator(popupSelector);
    if (await popup.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.page.locator(acceptBtnSelector).click();
    }
  }

  async pause() {
    await this.page.pause();
  }
}