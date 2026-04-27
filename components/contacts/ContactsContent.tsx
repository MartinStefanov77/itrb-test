"use client";

import { useEffect, useRef, useState } from "react";
import { RevealInteractions } from "@/components/site/RevealInteractions";
import { useI18n } from "@/lib/i18n";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  captcha_answer: string;
  agree: boolean;
  website: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

type StatusType = "success" | "error" | null;

export default function ContactsContent() {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
    captcha_answer: "",
    agree: false,
    website: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<{ message: string; type: StatusType }>({
    message: "",
    type: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "...", token: "" });

  const dict = {
    required: t("contact.field.required"),
    emailInvalid: t("contact.field.email.invalid"),
    success: t("contact.success"),
    error: t("contact.error"),
  };

  const loadCaptcha = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    const expires = Date.now() + 10 * 60 * 1000;
    setCaptcha({
      question: `${a} + ${b}`,
      token: btoa(`${a}:${b}:${expires}`),
    });
    setValues((prev) => ({ ...prev, captcha_answer: "" }));
    setErrors((prev) => ({ ...prev, captcha_answer: undefined }));
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const clearFieldError = (field: keyof ContactFormValues) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  const handleTextFieldChange =
    (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = e.target.value;
      setValues((prev) => ({ ...prev, [field]: nextValue }));
      clearFieldError(field);
    };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, agree: e.target.checked }));
    clearFieldError("agree");
  };

  const validate = () => {
    const nextErrors: ContactFormErrors = {};

    if (!values.name.trim()) nextErrors.name = dict.required;
    if (!values.email.trim()) nextErrors.email = dict.required;
    else if (!isValidEmail(values.email.trim())) nextErrors.email = dict.emailInvalid;
    if (!values.subject.trim()) nextErrors.subject = dict.required;
    if (!values.message.trim()) nextErrors.message = dict.required;
    if (!values.captcha_answer.trim()) nextErrors.captcha_answer = dict.required;
    if (!values.agree) nextErrors.agree = dict.required;

    setErrors(nextErrors);

    const firstErrorField = [
      "name",
      "email",
      "subject",
      "message",
      "captcha_answer",
      "agree",
    ].find((field) => nextErrors[field as keyof ContactFormErrors]);

    if (firstErrorField === "name") nameRef.current?.focus();
    if (firstErrorField === "email") emailRef.current?.focus();
    if (firstErrorField === "subject") subjectRef.current?.focus();
    if (firstErrorField === "message") messageRef.current?.focus();
    if (firstErrorField === "captcha_answer") captchaRef.current?.focus();
    if (firstErrorField === "agree") agreeRef.current?.focus();

    return Object.keys(nextErrors).length === 0;
  };

  const isSubmitDisabled = !values.agree || isSubmitting;

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      subject: "",
      message: "",
      captcha_answer: "",
      agree: false,
      website: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ message: "", type: null });
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("subject", values.subject);
      formData.append("message", values.message);
      formData.append("captcha_answer", values.captcha_answer);
      formData.append("captcha_token", captcha.token);
      formData.append("website", values.website);
      formData.append("agree", values.agree ? "on" : "");

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ message: data.message || dict.success, type: "success" });
        resetForm();
        loadCaptcha();
      } else {
        const message =
          typeof data.message === "string" ? data.message : dict.error;
        if (
          message.toLowerCase().includes("captcha") ||
          message.toLowerCase().includes("expired")
        ) {
          loadCaptcha();
        }
        setStatus({ message, type: "error" });
      }
    } catch {
      setStatus({ message: dict.error, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" data-page="contact">
      <RevealInteractions />
      <section className="section contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal-left">
              <h2 className="section-heading">{t("contact.heading")}</h2>
              <p>{t("contact.desc")}</p>
              <ul className="contact-details">
                <li>
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{t("contact.address")}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href="mailto:office@itrb.org">office@itrb.org</a>
                </li>
              </ul>
              <div className="contact-illustration">
                <img src="/images/contact.svg" alt="" role="presentation" />
              </div>
            </div>
            <div className="contact-form-wrap reveal-right">
              <form
                ref={formRef}
                className="contact-form"
                id="contactForm"
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="form-honeypot" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={values.website}
                    onChange={handleTextFieldChange("website")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                  <label htmlFor="name">
                    {t("contact.form.name")}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder=""
                    value={values.name}
                    onChange={handleTextFieldChange("name")}
                  />
                  <span className="field-error" id="error-name">{errors.name || ""}</span>
                </div>

                <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                  <label htmlFor="email">
                    {t("contact.form.email")}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder=""
                    value={values.email}
                    onChange={handleTextFieldChange("email")}
                  />
                  <span className="field-error" id="error-email">{errors.email || ""}</span>
                </div>

                <div className={`form-group ${errors.subject ? "has-error" : ""}`}>
                  <label htmlFor="subject">
                    {t("contact.form.subject")}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    ref={subjectRef}
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder=""
                    value={values.subject}
                    onChange={handleTextFieldChange("subject")}
                  />
                  <span className="field-error" id="error-subject">{errors.subject || ""}</span>
                </div>

                <div className={`form-group ${errors.message ? "has-error" : ""}`}>
                  <label htmlFor="message">
                    {t("contact.form.message")}
                    <span className="required-star">*</span>
                  </label>
                  <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder=""
                    value={values.message}
                    onChange={handleTextFieldChange("message")}
                  />
                  <span className="field-error" id="error-message">{errors.message || ""}</span>
                </div>

                <div
                  className={`form-group form-group--captcha ${errors.captcha_answer ? "has-error" : ""}`}
                  id="captchaGroup"
                >
                  <label htmlFor="captchaAnswer">
                    <span>{t("contact.form.captcha.label")}</span>
                    <strong id="captchaQuestion" className="captcha-question">
                      {captcha.question}
                    </strong>
                    <span className="captcha-equals">= ?</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    ref={captchaRef}
                    type="number"
                    id="captchaAnswer"
                    name="captcha_answer"
                    min={0}
                    max={18}
                    required
                    placeholder=""
                    value={values.captcha_answer}
                    onChange={handleTextFieldChange("captcha_answer")}
                  />
                  <input
                    type="hidden"
                    id="captchaToken"
                    name="captcha_token"
                    value={captcha.token}
                    readOnly
                  />
                  <span className="field-error" id="error-captcha">{errors.captcha_answer || ""}</span>
                </div>

                <div className={`form-group form-group--checkbox ${errors.agree ? "has-error" : ""}`}>
                  <label className="checkbox-label">
                    <input
                      ref={agreeRef}
                      type="checkbox"
                      id="agree"
                      name="agree"
                      required
                      checked={values.agree}
                      onChange={handleAgreeChange}
                    />
                    <span className="checkbox-text">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t("contact.form.agree"),
                        }}
                      />
                      {/* <Link
                        href="/privacy-policy"
                      {t("contact.form.agree")}{" "}
                      {/* <Link
                        href="/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t("contact.form.agree_link"),
                          }}
                        />
                      </Link> */}
                      <span className="required-star">*</span>
                    </span>
                  </label>
                  <span className="field-error" id="error-agree">{errors.agree || ""}</span>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-full ${isSubmitDisabled ? "is-disabled" : ""}`}
                  aria-disabled={isSubmitDisabled}
                  disabled={isSubmitDisabled}
                >
                  {isSubmitting ? "..." : t("contact.form.submit")}
                </button>
                <div
                  className={`form-status ${status.type ?? ""}`.trim()}
                  id="formStatus"
                >
                  {status.message}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
