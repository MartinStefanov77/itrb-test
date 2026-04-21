export default function ContactPage() {
  return (
    <main id="main-content" data-page="contact">
      <section className="section contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-heading">Let&apos;s Work Together</h2>
              <p>Discuss your infrastructure, cloud, or hybrid architecture requirements with our engineering team.</p>
              <ul className="contact-details">
                <li><svg viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg><span>42 Vitosha Blvd., 1000 Sofia, Bulgaria</span></li>
                <li><svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg><a href="mailto:office@itrb.org">office@itrb.org</a></li>
              </ul>
              <div className="contact-illustration">
              <img src="/images/contact.svg" alt="" role="presentation" />
            </div>
            </div>
            <div className="contact-form-wrap">
              <form className="contact-form" id="contactForm" noValidate>
                <div className="form-honeypot" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                    Full Name
                    <span className="required-star">*</span>
                  </label>
                  <input type="text" id="name" name="name" required placeholder="" />
                  <span className="field-error" id="error-name"></span>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                    <span className="required-star">*</span>
                  </label>
                  <input type="email" id="email" name="email" required placeholder="" />
                  <span className="field-error" id="error-email"></span>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject
                    <span className="required-star">*</span>
                  </label>
                  <input type="text" id="subject" name="subject" required placeholder="" />
                  <span className="field-error" id="error-subject"></span>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message
                    <span className="required-star">*</span>
                  </label>
                  <textarea id="message" name="message" rows={5} required placeholder=""></textarea>
                  <span className="field-error" id="error-message"></span>
                </div>

                <div className="form-group form-group--captcha" id="captchaGroup">
                  <label htmlFor="captchaAnswer">
                    <span>Anti-spam check:</span>
                    <strong id="captchaQuestion" className="captcha-question">
                      ...
                    </strong>
                    <span className="captcha-equals">= ?</span>
                    <span className="required-star">*</span>
                  </label>
                  <input type="number" id="captchaAnswer" name="captcha_answer" min={0} max={18} required placeholder="" />
                  <input type="hidden" id="captchaToken" name="captcha_token" />
                  <span className="field-error" id="error-captcha"></span>
                </div>

                <div className="form-group form-group--checkbox">
                  <label className="checkbox-label">
                    <input type="checkbox" id="agree" name="agree" required />
                    <span className="checkbox-text">
                      I agree that my personal data may be processed in accordance with the{" "}
                      <a href="/privacy-policy" target="_blank" rel="noreferrer">
                        Privacy Policy
                      </a>
                      <span className="required-star">*</span>
                    </span>
                  </label>
                  <span className="field-error" id="error-agree"></span>
                </div>

                <button type="submit" className="btn btn-primary btn-full">Send Message</button>
                <div className="form-status" id="formStatus"></div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
