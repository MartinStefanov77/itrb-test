export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="privacy-main" data-page="privacy">
      <div className="container">
        <div className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p className="privacy-intro">
            This privacy policy explains how ITRB collects, uses, and protects your personal information.
          </p>
        </div>
        <div className="privacy-sections">
          <article className="privacy-section">
            <h2>Data Controller</h2>
            <p>ITRB is the data controller for personal data processed through this website.</p>
          </article>
          <article className="privacy-section">
            <h2>Personal Data We Collect</h2>
            <p>We collect contact details and message contents submitted through our forms.</p>
          </article>
          <article className="privacy-section">
            <h2>Purpose of Processing</h2>
            <p>We process personal data to respond to inquiries and provide requested business communication.</p>
          </article>
        </div>
      </div>
    </main>
  );
}
