document.querySelector("main").insertAdjacentHTML("afterbegin", '<div id="user-messages"></div>');

const addUserMessage = (message) => {
  if(!message){
    return;
  }

  const messagesContainer = document.getElementById("user-messages");
  messagesContainer.insertAdjacentHTML("afterbegin", `<div role="dialog" aria-live="asertive" ><p>${message}</p></div>`);
  const newMessageElement = messagesContainer.firstChild;
  setTimeout(() => newMessageElement.remove(), 3000);
};

export default addUserMessage;