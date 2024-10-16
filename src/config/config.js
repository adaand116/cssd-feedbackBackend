/* eslint-disable no-undef */
(() => {
  window.validate = () => {
    const emailInputs = document.querySelectorAll("input[type=email]");

    let valid = true;

    emailInputs.forEach((emailInput) => {
      if (emailInput.value.trim() === "") {
        valid = false;
        return window.sv.addErrorMessage(emailInput, {
          message: window.svFeedback.canNotBeEmpty,
          isValid: function (e) {
            return e.target.value.trim() !== "";
          },
        });
      }
      if (!emailInput.validity.valid) {
        valid = false;
        window.sv.addErrorMessage(emailInput, {
          message: window.svFeedback.invalidEmail,
          isValid: function (e) {
            return e.target.validity.valid;
          },
        });
      }
    });

    return valid && window.sv.validate();
  };
})();
