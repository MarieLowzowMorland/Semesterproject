import sendContactForm from "../api/contact-form.js";
import { FieldError, FieldValid } from "../templates/svgIcons.js";

const validateInput = (inputElement) => {
  const { name, value, required, type, checked } = inputElement;
  const minlength = parseNumberOrDefault(
    inputElement.getAttribute("data-minlength"),
    0
  );

  let errorMessages = [];
  if (required) {
    errorMessages.push(
      validateRequired(requiredCheckValue(value, checked, type), name)
    );
  }
  if (type === "email") {
    errorMessages.push(validateEmail(value, name));
  }
  if (minlength > 0) {
    errorMessages.push(validateMinLength(value, minlength, name));
  }
  return errorMessages.filter((errorMessage) => errorMessage);
};

const parseNumberOrDefault = (number, fallback) => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (typeof number === "number" && !Number.isNaN(number)) {
    return number;
  }

  return fallback;
};

const requiredCheckValue = (value, checked, type) => {
  if (type !== "checkbox") {
    return value;
  }

  if (checked) {
    return "checked";
  } else {
    return "";
  }
};

const validateRequired = (value, name) => {
  if (!value || value.trim().length === 0) {
    return /*template*/ `${upperCaseFirst(name)} is required.`;
  } else {
    return "";
  }
};

const validateEmail = (value, name) => {
  const regEx = /\S+@\S+\.\S+/;
  if (!value || regEx.test(value)) {
    return "";
  } else {
    return /*template*/ `${upperCaseFirst(
      name
    )} must contain at least @ and a domain. I.e "test@example.com".`;
  }
};

const validateMinLength = (value, minLength, name) => {
  if (!value || value.trim().length < minLength) {
    return /*template*/ `${upperCaseFirst(name)} must be more than ${
      minLength - 1
    } without leading or trailing spaces. Currently ${
      value ? value.trim().length : 0
    } characters long`;
  } else {
    return "";
  }
};

const upperCaseFirst = (value) =>
  value.charAt(0).toUpperCase() + value.substr(1);

const addValidationToForm = (formId, onSuccess) => {
  const form = document.getElementById(formId);
  const formSubmit = form.querySelector("button[type='submit']");
  const errorSummaryId = `${formId}-error-summary`;
  const pureInputs = form.querySelectorAll("input");
  const selects = form.querySelectorAll("select");
  const checkboxes = form.querySelectorAll("input[type='checkbox']");
  const textInputs = [
    ...Array.from(form.querySelectorAll("input:not([type='checkbox'])")),
    ...Array.from(form.querySelectorAll("textarea")),
  ]
  const allFields = [
    ...Array.from(form.querySelectorAll("input, textarea, select")),
  ]

  const descriptionElementFor = (input) => {
    const descriptionId = input.getAttribute("aria-describedby");
    if (descriptionId) {
      return document.getElementById(descriptionId);
    } else {
      return null;
    }
  };

  const addFieldErrorMessage = (inputElement, errorMessages, ariaLive) => {
    const errorMessage = errorMessages
      .map((errorMessage) => `<p>${errorMessage}</p>`)
      .join("");

    const descriptionElement = descriptionElementFor(inputElement);
    const wrapperClasslist = inputElement.closest(".input-wrapper").classList;
    inputElement.removeEventListener("input", validateInputOnInputHandler);
    wrapperClasslist.add("valid");

    if (errorMessage) {
      wrapperClasslist.add("invalid");
      wrapperClasslist.remove("valid");
      inputElement.addEventListener("input", validateInputOnInputHandler);
      if (descriptionElement) {
        descriptionElement.innerHTML = errorMessage;
        ariaLive && descriptionElement.setAttribute("aria-live", ariaLive);
      }
    } else if (wrapperClasslist.contains("invalid")) {
      wrapperClasslist.remove("invalid");
      if (descriptionElement) {
        descriptionElement.innerHTML = "";
        descriptionElement.classList.remove("visible");
        descriptionElement.removeAttribute("aria-live");
      }
    }
  };

  const validateInputOnInputHandler = (event) => {
    const inputElement = event.target;
    addFieldErrorMessage(inputElement, validateInput(inputElement), "polite");
  };

  const validateInputOnBlurHandler = (event) => {
    const inputElement = event.target;
    addFieldErrorMessage(
      inputElement,
      validateInput(inputElement),
      "assertive"
    );
  };

  const removeErrorSummary = () => {
    const errorSummary = document.getElementById(errorSummaryId);
    if (errorSummary) {
      errorSummary.remove();
    }
  };

  const resetForm = () => {
    form.reset();
    removeErrorSummary();

    form.querySelectorAll(".input-wrapper")
      .forEach(wrapper => wrapper.classList.remove("valid"));
  };

  const fieldErrorToSummaryHtml = (inputWithErrorMessages) => {
    const { inputElement, errorMessages } = inputWithErrorMessages;
    if (!errorMessages) {
      return "";
    }

    const messages = errorMessages
      .map((errorMessage) => `<span>${errorMessage}</span>`)
      .join("");

    return /*template */ `
          <li>
            <a href="#${inputElement.id}">${messages}</a>
          </li>`;
  };

  const addErrorSummary = (inputsWithErrorMessages) => {
    removeErrorSummary();
    const numFieldsWithErrors = inputsWithErrorMessages.length;
    const listOfErrors = inputsWithErrorMessages
      .map(fieldErrorToSummaryHtml)
      .join("");

    const summary = /*template */ `
      <div id="${errorSummaryId}" role="alert" tabindex="-1" class="error-summary">
        <h2>There are ${numFieldsWithErrors} errors in this form</h2>
        <ul>
          ${listOfErrors}
        </ul>
      </div>`;
    form.insertAdjacentHTML("beforebegin", summary);
    document.getElementById(errorSummaryId).focus();
  };

  const validateForm = async (event) => {
    event.preventDefault();
    const inputsWithErrorMessages = allFields
      .map((inputElement) => {
        const errorMessages = validateInput(inputElement);
        addFieldErrorMessage(inputElement, errorMessages);
        return { inputElement, errorMessages };
      })
      .filter(
        (inputWithErrorMessages) => inputWithErrorMessages.errorMessages.length
      );

    const formIsValid = !inputsWithErrorMessages.length;
    if (formIsValid) {
      const canReset = await onSuccess();
      if (canReset) {
        resetForm();
      }
    } else {
      addErrorSummary(inputsWithErrorMessages);
    }
  };

  const addErrorFields = (input) => {
    const id = input.id;
    const errorId = `${id}-error`;
    const parent = input.parentElement;
    input.setAttribute("aria-describedby", errorId);

    input.insertAdjacentHTML(
      "beforebegin",
      /*template*/ `
      <div class="input-wrapper">
        <div class="field-icon">
          <button aria-label="Toggle visual error message." class="error-info-toggle">
            ${FieldError()}
          </button>
          <div aria-label="Field valid." class="field-valid-icon">
            ${FieldValid()}
          </div>
        </div>
        <div id="${errorId}" class="form-error"></div>
      </div>`
    );

    parent.querySelector(".input-wrapper").insertBefore(input, parent.querySelector(".field-icon"));

    parent.querySelector(".error-info-toggle").addEventListener("click", (event) =>{
      event.preventDefault();
      document.getElementById(errorId).classList.toggle("visible");
    });
  };

  const addErrorFieldsToSelect = (input) => {
    const id = input.id;
    const errorId = `${id}-error`;
    const parent = input.parentElement;
    input.setAttribute("aria-describedby", errorId);

    input.insertAdjacentHTML(
      "beforebegin",
      /*template*/ `
      <div class="input-wrapper">
        <div class="select-wrapper">
          <div class="arrow"></div>
          <div class="focus-border"></div>
        </div>
        <div class="field-icon">
          <button aria-label="Toggle visual error message." class="error-info-toggle">
            ${FieldError()}
          </button>
          <div aria-label="Field valid." class="field-valid-icon">
            ${FieldValid()}
          </div>
        </div>
        <div id="${errorId}" class="form-error"></div>
      </div>`
    );

    parent.querySelector(".select-wrapper").insertBefore(input, parent.querySelector(".arrow"));

    parent.querySelector(".error-info-toggle").addEventListener("click", (event) =>{
      event.preventDefault();
      document.getElementById(errorId).classList.toggle("visible");
    });
  };

  const addErrorFieldsToCheckboxes = (input) => {
    const id = input.id;
    const errorId = `${id}-error`;
    const parent = input.parentElement;
    const label = parent.querySelector("label");
    input.setAttribute("aria-describedby", errorId);

    input.insertAdjacentHTML(
      "beforebegin",
      /*template*/ `
      <div class="input-wrapper checkbox-wrapper">
        <div class="field-icon">
          <button aria-label="Toggle visual error message." class="error-info-toggle">
            ${FieldError()}
          </button>
          <div aria-label="Field valid." class="field-valid-icon">
            ${FieldValid()}
          </div>
        </div>
        <div id="${errorId}" class="form-error"></div>
      </div>`
    );

    parent.querySelector(".checkbox-wrapper").insertBefore(input, parent.querySelector(".field-icon"));
    parent.querySelector(".checkbox-wrapper").insertBefore(label, parent.querySelector(".field-icon"));

    parent.querySelector(".error-info-toggle").addEventListener("click", (event) =>{
      event.preventDefault();
      document.getElementById(errorId).classList.toggle("visible");
    });
  };

  const submitOnEnter = (event) => {
    const enterPressed = event.key === "Enter" || event.keyCode === 13;
    if ( enterPressed ) {
        event.stopPropagation();
        formSubmit.click();
    }
  }

  form.addEventListener("submit", validateForm);

  [...pureInputs, ...selects].forEach(input => 
    input.addEventListener("keydown", submitOnEnter)
  );
  textInputs.forEach((input) => {
    addErrorFields(input);
    input.addEventListener("blur", validateInputOnBlurHandler);
  });
  checkboxes.forEach((input) => {
    addErrorFieldsToCheckboxes(input);
    input.addEventListener("blur", validateInputOnBlurHandler);
  });
  selects.forEach((input) => {
    addErrorFieldsToSelect(input);
    input.addEventListener("blur", validateInputOnBlurHandler);
  });
};

export default addValidationToForm;
