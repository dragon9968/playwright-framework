import { BasePage } from '../base/BasePage';
import { LoginPageUI } from '../pageUI/LoginPageUI';

export class LoginPage extends BasePage {
  async enterEmail(email: string) {
    await this.step(`Nhập email: ${email}`, async () => {
      await this.fillInput(LoginPageUI.emailField, email);
    });
  }

  async enterPassword(password: string) {
    await this.step(`Nhập password: ${password}`, async () => {
      await this.fillInput(LoginPageUI.passwordField, password);
    });
  }

  async clickLoginButton() {
    await this.step('Bấm nút Login', async () => {
      await this.waitForElementVisible(LoginPageUI.loginButton);
      await this.clickElement(LoginPageUI.loginButton, { noWaitAfter: true });
    });
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async verifyLoginSuccess() {
    await this.step('Xác minh chuyển hướng tới trang Customer Account', async () => {
      await this.expectExactURL('http://live.techpanda.org/index.php/customer/account/');
    });
  }

  async verifyFieldError(field: string, expectedMessage: string) {
    await this.step(`Xác minh lỗi bắt buộc nhập tại trường "${field}": "${expectedMessage}"`, async () => {
      await this.expectText(LoginPageUI.fieldError(field), expectedMessage);
    });
  }

  async verifyEmailValidationMessage(expectedMessage: string) {
    await this.step(`Xác minh thông báo lỗi trình duyệt tại ô Email: "${expectedMessage}"`, async () => {
      await this.expectValidationMessage(LoginPageUI.emailField, expectedMessage);
    });
  }

  async verifyEmailFormatError(expectedMessage: string) {
    await this.step(`Xác minh lỗi định dạng Email trên form: "${expectedMessage}"`, async () => {
      await this.expectText(LoginPageUI.emailFormatError, expectedMessage);
    });
  }

  async verifyLoginFailedMessage(expectedMessage: string) {
    await this.step(`Xác minh thông báo đăng nhập thất bại: "${expectedMessage}"`, async () => {
      await this.expectText(LoginPageUI.loginFailedMessage, expectedMessage);
    });
  }
}