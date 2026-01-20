
export class LoginPageUI {

      static loginButton = '//button[@title="Login"]';
      static emailField = 'input[id="email"]';
      static passwordField = 'input#pass';
      // error messages
  static fieldError =  (field: string) => `#advice-required-entry-${field}`;
 static emailFormatError = "#advice-validate-email-email";
  static loginFailedMessage = ".error-msg span"
}
