import { FacebookIcon, InstagramIcon, TwitterIcon } from "../templates/svgIcons.js"

const addFooterForPage = () => {
  document
    .querySelector("main")
    .insertAdjacentHTML("afterend", footerTemplate());
}

const footerTemplate = () => /*template*/`
  <footer>
    <div>
      <section>
        <h2>Follow us</h2>
        <div class="social-media">
          <a
            href="https://www.facebook.com"
            rel="noopener"
            target="_blank"
            aria-label="Open Facebook"
          >
            ${ FacebookIcon() }
          </a>
          <a
            href="https://www.instagram.com"
            rel="noopener"
            target="_blank"
            aria-label="Open Instagram"
          >
            ${ InstagramIcon() }
          </a>
          <a
            href="https://www.twitter.com"
            rel="noopener"
            target="_blank"
            aria-label="Open Twitter"
          >
            ${ TwitterIcon() }
          </a>
        </div>
      </section>

      <section>
        <h2>Opening hours</h2>
        <ul>
          <li>Monday: Closed</li>
          <li>Tuesday: 12:00 - 18:00</li>
          <li>Wednesday: 12:00 - 18:00</li>
          <li>Thursday: 12:00 - 18:00</li>
          <li>Friday: 12:00 - 18:00</li>
          <li>Saturday: 12:00 - 18:00</li>
          <li>Sunday: 12:00 - 18:00</li>
        </ul>
      </section>

      <section id="contact-information">
        <div>
          <h2>Contact</h2>
          <span>
            Mail:
            <a href="mailto:post@csm.com">post@csm.com</a>
          </span>
          <p>Phone: 102 23 321</p>
        </div>
        <div>
          <h2>Location</h2>
          <a
            href="https://goo.gl/maps/mq1w1BqNkhY4VGw29"
            rel="noopener"
            target="_blank"
          >
            Vårveien 55,<br />
            1182 Oslo
          </a>
          <img
            class="marker-icon"
            src="./images/marker.svg"
            height="40"
            width="33"
            alt=""
          />
        </div>
      </section>
      <div>
        <div
          id="footer-map"
          class="desktop-shown"
          role="img"
          aria-label="map where to find the museum"
        ></div>
      </div>
    </div>
  </footer>`;

export default addFooterForPage;