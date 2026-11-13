import { BasePage } from '../base/BasePage';
import { RegisterPageUI } from '../pageUI/RegisterPageUI';


export class RegisterPage extends BasePage {
 /* constructor(page: Page) {
    this.page = page;
    const bagePage = new BasePage(page) // dùng trực tiếp, ko cần kế thưa BásePage nữa
  }*/ 

  async enterFirstname(firstname: string) {
    await this.step(`Nhập firstname: ${firstname}`, async () => {
    await this.fillInput(RegisterPageUI.firstnameField, firstname);
    await this.wait();
        });
  }

  async enterLastname(lastname: string) {
    await this.step(`Nhập lastname: ${lastname}`, async () => {
    await this.fillInput(RegisterPageUI.lastnameField, lastname);
    await this.wait();
    });
  }

  async enterMiddlename(middlename: string) {
    await this.step(`Nhập middlename: ${middlename}`, async () => {
    await this.fillInput(RegisterPageUI.middlenameField, middlename);
    await this.wait();
    });
  }

  async enterEmail(email: string) {
    await this.step(`Nhập email: ${email}`, async () => {
    await this.fillInput(RegisterPageUI.emailField, email);
    await this.wait();
    });
  }

  async enterPassword(password: string) {
    await this.step(`Nhập password: ${password}`, async () => {
    await this.fillInput(RegisterPageUI.passwordField, password);
    await this.wait();
    });
  }

  async enterConfirmPassword(confirmpassword: string) {
     await this.step(`Nhập confirmpassword: ${confirmpassword}`, async () => {
    await this.fillInput(RegisterPageUI.confirmpasswordField, confirmpassword);
    await this.wait();
     });
  }

  async checkonSubscribedCheckbox() {
      await this.step(`Tick vào Subscribe checkbox`, async () => {
    await this.page.check(RegisterPageUI.subscribedCheckbox);
    await this.wait();
      });
  }

  async clickRegisterButton(): Promise<void> {
        await this.step(`Click nút Register`, async () => {
        await this.waitForElementVisible(RegisterPageUI.registerButton);
        await this.clickElement(RegisterPageUI.registerButton);
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
  
  async verifyFieldError(fieldName: string, expectedMessage: string) {
    await this.step(`Xác minh lỗi tại trường "${fieldName}": ${expectedMessage}`, async () => {
      await this.expectText(RegisterPageUI.fieldError(fieldName), expectedMessage);
    });
  }

  async verifyEmailValidationMessage(expectedMessage: string) {
    await this.step(`Xác minh thông báo lỗi định dạng Email: "${expectedMessage}"`, async () => {
      await this.expectValidationMessage(RegisterPageUI.emailField, expectedMessage);
    });
  }

  async verifyMinLengthPasswordError(expectedMessage: string) {
    await this.step(`Xác minh lỗi độ dài mật khẩu tối thiểu: "${expectedMessage}"`, async () => {
      await this.expectText(RegisterPageUI.passwordMinLengthError, expectedMessage);
    });
  }

  async verifyPasswordMismatchError(expectedMessage: string) {
    await this.step(`Xác minh lỗi xác nhận mật khẩu không khớp: "${expectedMessage}"`, async () => {
      await this.expectText(RegisterPageUI.passwordMismatchError, expectedMessage);
    });
  }
}