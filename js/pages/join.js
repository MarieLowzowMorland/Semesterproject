import addUserMessage from "../components/userMessage.js";
import addValidationToForm from "../components/formValidation.js";
import sendContactForm from "../api/contact-form.js";
import addHeaderForPage, { pageNames } from "../templates/header.js";
import addFooterForPage from "../templates/footer.js";

addHeaderForPage(pageNames.JOIN);
addFooterForPage();

addValidationToForm("join-form", async () => {
  const mailSent = await sendContactForm(document.getElementById("join-form"));
  const userMessage = mailSent ? "Your request to join event has been sent!" : "A problem occured, please grab a cup of coffee and try again later.";
  addUserMessage(userMessage);
  return userMessage;
});