import { ProductPageUI } from "../pageUI/ProductPageUI";
import { BasePage } from '../base/BasePage';
import { allure } from 'allure-playwright';

export class ProductPage extends BasePage {
    
  async addToCart() {
    await this.clickElement(ProductPageUI.ADD_TO_CART_BUTTON);
    // xử lý popup HTML nếu có
    await this.handleHtmlWarningPopup(
      ProductPageUI.WARNING_POPUP,
      ProductPageUI.WARNING_ACCEPT_BUTTON
    );
  }

  async addToCartWithBypass() {
  await this.acceptNextDialog();
  await this.clickElement(ProductPageUI.ADD_TO_CART_BUTTON);
  }

  async openCart() {
    await this.clickElement(ProductPageUI.CART_ICON);
    await this.clickElement(ProductPageUI.VIEW_CART);
  }
}
