import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { MobilePageUI_getByRole } from '../pageUI/MobilePageUI_getByRole';
import { PageUrl } from '../constants/PageUrl';

export class MobilePage_getByRole extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==========================================
  // 1. THANH ĐIỀU HƯỚNG & TOOLBAR
  // ==========================================

  async goToMobilePage() {
    await this.navigateTo(PageUrl.MOBILE);
  }

  // Khóa cứng vào đúng thanh toolbar trên cùng bằng .first() để không bao giờ bị lỗi Strict Mode
  private get topToolbar(): Locator {
    return this.page.locator('.toolbar').first();
  }

  async selectSortBy(option: 'Name' | 'Price') {
    await this.topToolbar.getByRole('combobox', { name: 'Sort By' }).selectOption({ label: option });
    // Dùng networkidle để trang tải xong 100% dữ liệu mới trước khi chạy bước tiếp theo
    await this.waitForPageLoad('networkidle');
  }

  async clickListView() {
    await this.topToolbar.getByRole('link', { name: 'List', exact: true }).click();
    // Chờ mạng tải xong view danh sách
    await this.waitForPageLoad('networkidle');
  }

  async isListViewDisplayed(): Promise<boolean> {
    return await this.page.locator(MobilePageUI_getByRole.LIST_VIEW_CONTAINER).isVisible();
  }

  async isProductDescriptionVisible(): Promise<boolean> {
    return await this.page.locator(MobilePageUI_getByRole.PRODUCT_DESC).first().isVisible();
  }

  async isListViewIconActive(): Promise<boolean> {
    return await this.topToolbar.locator('strong[title="List"]').isVisible();
  }

  // ==========================================
  // 2. KHỐI XỬ LÝ SẢN PHẨM CHUNG (GETBYROLE + FILTER)
  // ==========================================

  /** Định vị duy nhất 1 thẻ Card sản phẩm dựa trên Tên hiển thị */
  getProductCard(productName: string): Locator {
    return this.page.locator(MobilePageUI_getByRole.PRODUCT_ITEM).filter({
      has: this.page.getByRole('heading', { name: productName, exact: true }),
    });
  }

  /** Lấy giá tiền của bất kỳ sản phẩm nào theo tên */
  async getProductPriceByName(productName: string): Promise<string> {
    const card = this.getProductCard(productName);
    const priceText = await card.locator(MobilePageUI_getByRole.PRICE).first().innerText();
    return priceText.trim();
  }

  /** Bấm vào link chi tiết của bất kỳ sản phẩm nào */
  async clickProductDetailByName(productName: string) {
    const card = this.getProductCard(productName);
    await card.getByRole('heading').getByRole('link').click();
    await this.waitForElementVisible(MobilePageUI_getByRole.DETAIL_PAGE_PRODUCT_PRICE);
  }

  /** Bấm Add to Cart của bất kỳ sản phẩm nào */
  async clickAddToCartByName(productName: string) {
    const card = this.getProductCard(productName);
    await card.getByRole('button', { name: 'Add to Cart' }).click();
  }

  // ==========================================
  // 3. TƯƠNG THÍCH NGƯỢC (CHO CÁC TEST HIỆN TẠI)
  // ==========================================

  async getProductNames(): Promise<string[]> {
    return await this.getAllInnerTexts(
      MobilePageUI_getByRole.PRODUCT_NAMES,
      'Lấy danh sách tên sản phẩm trên màn hình'
    );
  }

  async getProductPrices(): Promise<number[]> {
    const pricesText = await this.page.locator(MobilePageUI_getByRole.PRODUCT_PRICES).allInnerTexts();
    return pricesText.map((price) => parseFloat(price.replace('$', '').replace(',', '')));
  }

  async getSonyXperiaPriceInList(): Promise<string> {
    return await this.getProductPriceByName('Sony Xperia');
  }

  async clickSonyXperiaDetail() {
    await this.clickProductDetailByName('Sony Xperia');
  }

  async getSonyXperiaPriceInDetail(): Promise<string> {
    return await this.getElementText(MobilePageUI_getByRole.DETAIL_PAGE_PRODUCT_PRICE);
  }

  async clickAddToCartSonyXperia() {
    await this.clickAddToCartByName('Sony Xperia');
  }

  // ==========================================
  // 4. MENU TRANG CHỦ
  // ==========================================

  async clickMobileMenu() {
    await this.page.locator(MobilePageUI_getByRole.NAV_CONTAINER).getByRole('link', { name: 'Mobile', exact: true }).click();
  }

  async clickTVMenu() {
    await this.page.locator(MobilePageUI_getByRole.NAV_CONTAINER).getByRole('link', { name: 'TV', exact: true }).click();
  }
}