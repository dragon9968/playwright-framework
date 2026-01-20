import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HomePageUI } from "../pageUI/HomePageUI";

export class HomePage extends BasePage {
    private menuAccountLink = 'a[data-target-element="#header-account"]';
    private registerLink = 'a[title="Register"]';
    private loginLink = 'a[title="Log In"]';
    private logoutLink = 'a[title="Log Out"]';

    async click_Menu_Account_Link() {
        await this.clickElement(this.menuAccountLink);
      }

    async click_Register_Link() {
        await this.clickElement(this.registerLink);
      }

      async click_Login_Link() {
        await this.clickElement(this.loginLink);
      }

      async click_Logout_Link() {
        await this.clickElement(this.logoutLink);
      }

      async openCategoryMobile() {
      await this.goTo("https://live.techpanda.org/index.php/mobile.html");
      }

      async openFirstProduct() {
      await this.clickElement(HomePageUI.FIRST_PRODUCT_LINK);
      }
}