import styles from "./HeroSection.module.scss";

type Props = {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  subtitleSmall: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HeroSection({ titleLine1, titleLine2, subtitle, subtitleSmall, ctaLabel, ctaHref }: Props) {
  return (
    <section className={`hero ${styles.root}`}>
      <div className="hero-video-wrap" aria-hidden="true">
        <video id="heroVideo" autoPlay muted loop playsInline>
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">{titleLine1}</span>
          <span className="hero-title-line hero-title-accent">{titleLine2}</span>
        </h1>
        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-subtitle hero-subtitle--small">{subtitleSmall}</p>
        <div className="hero-actions">
          <a href={ctaHref} className="btn btn-primary">{ctaLabel}</a>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-dot"></div>
        <div className="scroll-line-wrap"><div className="scroll-line"></div></div>
      </div>
    </section>
  );
}
