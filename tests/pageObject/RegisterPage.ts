import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { allure } from 'allure-playwright';
import { RegisterPageUI } from '../pageUI/RegisterPageUI';


export class RegisterPage extends BasePage {
/*   constructor(page: Page) {
    this.page = page;
    this.registerButton = page.getByRole('button', { name: 'Register' });
    const bagePage = new BasePage(page)

  } */

 /* async navigateToRegisterPage() {
    await this.page.goto('/');
  }*/

  async enterFirstname(firstname: string) {
    await allure.step(`Nhập firstname: ${firstname}`, async () => {
    //await this.page.fill(this.firstnameField, firstname);
    await this.fillInput(RegisterPageUI.firstnameField, firstname);
    await this.wait();
        });
  }

  async enterLastname(lastname: string) {
    await allure.step(`Nhập lastname: ${lastname}`, async () => {
    //await this.page.fill(this.lastnameField, lastname);
    await this.fillInput(RegisterPageUI.lastnameField, lastname);
    await this.wait();
    });
  }

  async enterMiddlename(middlename: string) {
    await allure.step(`Nhập middlename: ${middlename}`, async () => {
    //await this.page.fill(this.middlenameField, middlename);
    await this.fillInput(RegisterPageUI.middlenameField, middlename);
    await this.wait();
    });
  }

  async enterEmail(email: string) {
    await allure.step(`Nhập email: ${email}`, async () => {
    //await this.page.fill(this.emailField, email);
    await this.fillInput(RegisterPageUI.emailField, email);
    await this.wait();
    });
  }

  async enterPassword(password: string) {
    await allure.step(`Nhập password: ${password}`, async () => {
    //await this.page.fill(this.passwordField, password);
    await this.fillInput(RegisterPageUI.passwordField, password);
    await this.wait();
    });
  }

  async enterConfirmPassword(confirmpassword: string) {
     await allure.step(`Nhập confirmpassword: ${confirmpassword}`, async () => {
    //await this.page.fill(this.confirmpasswordField, confirmpassword);
    await this.fillInput(RegisterPageUI.confirmpasswordField, confirmpassword);
    await this.wait();
     });
  }

  async checkonSubscribedCheckbox() {
      await allure.step(`Tick vào Subscribe checkbox`, async () => {
    await this.page.check(RegisterPageUI.subscribedCheckbox);
    await this.wait();
      });
  }

  async clickRegisterButton(): Promise<void> {
      await allure.step(`Click nút Register`, async () => {
    //await this.clickElementByRole('button', 'Register');
        await this.clickElement(RegisterPageUI.registerButton);
        await this.wait();
    
      });
  }

  async register(firstname: string, middlename: string, lastname: string, email: string,
      password: string, confirmpassword: string) {
    await this.enterFirstname(firstname);
    await this.enterMiddlename(middlename);
    await this.enterLastname(lastname);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.enterConfirmPassword(confirmpassword);
    await this.checkonSubscribedCheckbox();
    await this.clickRegisterButton();
  }

  async getFieldError(fieldName: string) {
    return this.getElementText(RegisterPageUI.fieldError(fieldName));
  }

  async getPasswordMismatchError() {
    return await this.getElementText(RegisterPageUI.passwordMismatchError);
  }

  async getMinLengthPasswordError() {
    return await this.getElementText(RegisterPageUI.passwordMinLengthError);
  }

  async getEmailToastError() {
    return this.getAttribute(RegisterPageUI.emailToastError, "validationMessage");
  }
  
  async getEmailValidationMessage() {
  //const locator = this.page.locator(RegisterPageUI.emailField);
  //return await locator.evaluate((el: any) => el.validationMessage);
  return await this.getValidationMessageById("email_address");
}
}