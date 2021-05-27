const contactFormUrl = "https://morlanddesign.one/csciencemuseum-admin/wp-json/contact-form-7/v1/contact-forms/5/feedback";

const sendContactForm = async (form) => {
  const rawResponse = await fetch(contactFormUrl, {
    method: 'POST',
    body: new FormData(form)
  });
  const content = await rawResponse.json();
  return content.status === "mail_sent";
};

export default sendContactForm;