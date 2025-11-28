import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LoginPageUI } from '../pageUI/LoginPageUI';
import { step } from '../ultility/step-decorator';
import { AllureHelper } from "../helpers/AllureHelper";
import { allure } from 'allure-playwright';

export class LoginPage extends BasePage {
    //private emailField = 'input[id="email"]';
   // private passwordField = 'input#pass';

 /* async navigateLoginPage() {
    await this.page.goto('/');
  }*/

  
  async enterEmail(email: string) {
   await AllureHelper.step(`Nhập email: ${email}`, async () => {
  // await allure.step(`Nhập email: ${email}`, async () => {
   // await this.step(`Nhập email: ${email}`, async () => {

    await this.fillInput(LoginPageUI.emailField, email);
    });
  }
 

  async enterPassword(password: string) {
     await allure.step(`Nhập password: ${password}`, async () => {
    await this.fillInput(LoginPageUI.passwordField, password);
        });
  }


 async clickLoginButton(): Promise<void> {
    await allure.step(`Click nút Login`, async () => {
    //await this.clickElementByRole('button', 'Login');
    await this.clickElement(LoginPageUI.loginButton);
      });
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async verifyLoginSuccess() {
    // Gọi lại hàm ở BasePage
    await this.expectExactURL('http://live.techpanda.org/index.php/customer/account/s');
  }
}