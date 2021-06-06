import { HamburgerMenu, Logo } from "../templates/svgIcons.js";

export const pageNames = {
  HOME: {
    name: "Home",
    url: "index.html",
  },
  DONATE: {
    name: "Donate",
    url: "donate.html",
  },
  JOIN: {
    name: "Join an event",
    url: "join.html",
  },
  EXHIBITIONS: {
    name: "Exhibitions",
    url: "exhibitions.html",
  },
  INVOLVE: {
    name: "Involve",
    url: "involve.html",
  },
  ABOUT: {
    name: "About",
    url: "about.html",
  },
  YOUR_VISIT: {
    name: "Plan your visit",
    url: "your-visit.html",
  },
};

const toggleMenu = (event) => {
  event.stopPropagation();
  const menuButton = document.getElementById("menu-button");
  if(menuButton.classList.contains("open")){
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-label", "Expand menu");
    document.getElementById("menu").classList.remove("open-menu");
  } else {
    menuButton.classList.add("open");
    menuButton.setAttribute("aria-label", "Collapse menu");
    document.getElementById("menu").classList.add("open-menu");
  }
  menuButton.focus();
};

const addHeaderForPage = (selectedPage) => {
  document
    .querySelector("main")
    .insertAdjacentHTML("beforebegin", headerTemplate(selectedPage));

  document.getElementById("menu-button").addEventListener("click", toggleMenu);
  document.getElementById("close-menu").addEventListener("click", toggleMenu);
};

const link = (selectedPage, linkToPage) => {
  let classNames = "heading";
  let ariaCurrentAttr = "";
  if( selectedPage === linkToPage ){
    classNames += " active";
    ariaCurrentAttr = 'aria-current="page"';
  }
  
  return /*template*/ `
  <li>
    <a href="${linkToPage.url}" 
      ${ariaCurrentAttr}
      class="${classNames}"
    >
      ${linkToPage.name}
    </a>
  </li>`
};

const headerTemplate = (selectedPage) => {
  let homeClassName = "";
  let homeAriaCurrentAttr = "";
  if( selectedPage === pageNames.HOME ){
    homeClassName += " active";
    homeAriaCurrentAttr = 'aria-current="page"';
  }

  return /*template*/ `
    <header>
      <nav id="skiplink" aria-label="Skiplink menu">
        <a href="#main" class="skiplink" aria-label="Go to main content">Main content</a>
      </nav>
      <nav>
        <a id="logo"
          href="${pageNames.HOME.url}"
          ${homeAriaCurrentAttr}
          class="${homeClassName}"
        >
          ${ Logo() }
        </a>
        <button id="menu-button" aria-label="Expand menu">
          ${ HamburgerMenu() }
        </button>
        <div id="menu">
          <ul>
            ${link(selectedPage, pageNames.EXHIBITIONS)}
            ${link(selectedPage, pageNames.YOUR_VISIT)}
            ${link(selectedPage, pageNames.JOIN)}
            ${link(selectedPage, pageNames.INVOLVE)}
            ${link(selectedPage, pageNames.ABOUT)}
            ${link(selectedPage, pageNames.DONATE)}
            <li><button id="close-menu">Close menu</button></li>
          </ul>
        </div>
      </nav>
    </header>`;
};

export default addHeaderForPage;
