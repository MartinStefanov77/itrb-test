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
                <li><span>42 Vitosha Blvd., 1000 Sofia, Bulgaria</span></li>
                <li><a href="mailto:office@itrb.org">office@itrb.org</a></li>
              </ul>
            </div>
            <div className="contact-form-wrap">
              <form className="contact-form">
                <div className="form-group"><label htmlFor="name">Full Name</label><input id="name" name="name" /></div>
                <div className="form-group"><label htmlFor="email">Email Address</label><input id="email" name="email" type="email" /></div>
                <div className="form-group"><label htmlFor="subject">Subject</label><input id="subject" name="subject" /></div>
                <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5}></textarea></div>
                <button type="submit" className="btn btn-primary btn-full">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
