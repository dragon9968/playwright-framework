export const RegisterPageUI = {

firstnameField :'input#firstname',
middlenameField : 'input#middlename',
lastnameField : 'input#lastname',
emailField : 'input[id="email_address"]',
passwordField : 'input#password',
confirmpasswordField : 'input#confirmation',
subscribedCheckbox : 'input#is_subscribed',
registerButton : '//button[@title="Register"]',
 // error messages
  fieldError: (field: string) => `#advice-required-entry-${field}`,
    emailToastError: '#email_address:invalid',

     // Password mismatch error (Magento có sẵn)
  passwordMismatchError: "#advice-validate-cpassword-confirmation",

  // Password min length
  passwordMinLengthError: "#advice-validate-password-password"
}

