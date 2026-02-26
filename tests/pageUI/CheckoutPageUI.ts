export const CheckoutPageUI = {
  // Checkout method
  GUEST_RADIO: "#login\:guest",
  CONTINUE: "#onepage-guest-register-button",

  // Billing
  FIRST_NAME: "//input[@name='billing[firstname]']",
  LAST_NAME: "//input[@name='billing[lastname]']",
  EMAIL: "//input[@name='billing[email]']",
  ADDRESS: "//input[@name='billing[street][]' and @title='Street Address']",
  CITY: "//input[@name='billing[city]']",
  ZIP: "//input[@name='billing[postcode]']",
    // 👉 State / Province (dropdown)
  STATE_PROVINCE : "//select[@name='billing[region_id]']",
  TELEPHONE: "//input[@name='billing[telephone]']",
  BILLING_CONTINUE: "#billing-buttons-container button",


  // Shipping Method
  SHIPPING_RADIO: "input[name='shipping_method']",
  SHIPPING_CONTINUE: "#shipping-method-buttons-container button",

  // Payment
  PAYMENT_CHECK: "#p_method_checkmo",
  PAYMENT_CONTINUE: "#payment-buttons-container button",

  // Place order
  PLACE_ORDER_BUTTON: "button[title='Place Order']",  

  // Success
  SUCCESS_MESSAGE: ".checkout-onepage-success span"
};
