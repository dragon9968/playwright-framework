import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

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
}