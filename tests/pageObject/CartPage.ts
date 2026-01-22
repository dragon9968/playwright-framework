import { BasePage } from '../base/BasePage';
import { CartPageUI } from "../pageUI/CartPageUI";

export class CartPage extends BasePage {
  async proceedToCheckout() {
    await this.clickElement(CartPageUI.PROCEED_TO_CHECKOUT);
  }
}
