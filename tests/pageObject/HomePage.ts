import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HomePageUI } from "../pageUI/HomePageUI";

export class HomePage extends BasePage {
  private menuAccountLink = 'a[data-target-element="#header-account"]';
  private registerLink = 'a[title="Register"]';
  private loginLink = 'a[title="Log In"]';
  private logoutLink = 'a[title="Log Out"]';

  async click_Menu_Account_Link() {
    await this.waitForElementVisible(this.menuAccountLink);
    await this.clickElement(this.menuAccountLink, { force: true });
  }

  async click_Register_Link() {
    await this.waitForElementVisible(this.registerLink);
    await this.clickElement(this.registerLink, { force: true });
  }

  async click_Login_Link() {
    await this.waitForElementVisible(this.loginLink);
    await this.clickElement(this.loginLink, { force: true });
  }

  async click_Logout_Link() {
    await this.waitForElementVisible(this.logoutLink);
    await this.clickElement(this.logoutLink, { force: true });
  }

  async openCategoryMobile() {
    await this.navigateTo("https://live.techpanda.org/index.php/mobile.html");
  }

  async openFirstProduct() {
    await this.clickElement(HomePageUI.FIRST_PRODUCT_LINK);
  }
}