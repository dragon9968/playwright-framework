import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { allure } from 'allure-playwright';


export class RegisterPage extends BasePage {
 // private page: Page;
  private firstnameField = 'input#firstname';
  private middlenameField = 'input#middlename';
  private lastnameField = 'input#lastname';
  private emailField = 'input[id="email_address"]';
  private passwordField = 'input#password';
  private confirmpasswordField = 'input#confirmation';
  private subscribedCheckbox = 'input#is_subscribed';
 // private registerButton : Locator;

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
    await this.fillInput(this.firstnameField, firstname);
        });
  }

  async enterLastname(lastname: string) {
    await allure.step(`Nhập lastname: ${lastname}`, async () => {
    //await this.page.fill(this.lastnameField, lastname);
    await this.fillInput(this.lastnameField, lastname);
    });
  }

  async enterMiddlename(middlename: string) {
    await allure.step(`Nhập middlename: ${middlename}`, async () => {
    //await this.page.fill(this.middlenameField, middlename);
    await this.fillInput(this.middlenameField, middlename);
    });
  }

  async enterEmail(email: string) {
    await allure.step(`Nhập email: ${email}`, async () => {
    //await this.page.fill(this.emailField, email);
    await this.fillInput(this.emailField, email);
    });
  }

  async enterPassword(password: string) {
    await allure.step(`Nhập password: ${password}`, async () => {
    //await this.page.fill(this.passwordField, password);
    await this.fillInput(this.passwordField, password);
    });
  }

  async enterConfirmPassword(confirmpassword: string) {
     await allure.step(`Nhập confirmpassword: ${confirmpassword}`, async () => {
    //await this.page.fill(this.confirmpasswordField, confirmpassword);
    await this.fillInput(this.confirmpasswordField, confirmpassword);
     });
  }

  async checkonSubscribedCheckbox() {
      await allure.step(`Tick vào Subscribe checkbox`, async () => {
    await this.page.check(this.subscribedCheckbox);
      });
  }

  async clickRegisterButton(): Promise<void> {
      await allure.step(`Click nút Register`, async () => {
    await this.clickElementByRole('button', 'Register');
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
}