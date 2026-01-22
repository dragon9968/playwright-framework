import { BasePage } from "../base/BasePage";
import { CheckoutPageUI } from "../pageUI/CheckoutPageUI";

export class CheckoutPage extends BasePage {
  async checkoutAsGuest() {
   // await this.clickElement(CheckoutPageUI.GUEST_RADIO);
    await this.clickElement(CheckoutPageUI.CONTINUE);
  }

  async fillBillingInformation(data: any) {
    await this.fillInput(CheckoutPageUI.FIRST_NAME, data.firstName);
    await this.fillInput(CheckoutPageUI.LAST_NAME, data.lastName);
    await this.fillInput(CheckoutPageUI.EMAIL, data.email);
    await this.fillInput(CheckoutPageUI.ADDRESS, data.address);
    await this.fillInput(CheckoutPageUI.CITY, data.city);
    await this.fillInput(CheckoutPageUI.ZIP, data.zip);
    await this.fillInput(CheckoutPageUI.TELEPHONE, data.telephone);
    await this.clickElement(CheckoutPageUI.BILLING_CONTINUE);
     // 👉 State / Province (BẮT BUỘC)
    await this.select(
      CheckoutPageUI.STATE_PROVINCE,
      data.state
    );
    await this.select(
      CheckoutPageUI.STATE_PROVINCE,
      data.state
    );
  }

  async selectShippingMethod() {
    await this.clickElement(CheckoutPageUI.SHIPPING_RADIO);
    await this.clickElement(CheckoutPageUI.SHIPPING_CONTINUE);
  }

  async selectPaymentMethod() {
    await this.clickElement(CheckoutPageUI.PAYMENT_CHECK);
    await this.clickElement(CheckoutPageUI.PAYMENT_CONTINUE);
  }

  async placeOrder() {
    await this.clickElement(CheckoutPageUI.PLACE_ORDER_BUTTON);
  }

  async getSuccessMessage() {
    return await this.getElementText(CheckoutPageUI.SUCCESS_MESSAGE);
  }
}
