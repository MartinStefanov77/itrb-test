"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export function TeamSlider() {
  const { t } = useI18n();

  const members: TeamMember[] = useMemo(
    () => [
      {
        name: t("team.name1"),
        role: t("team.role1"),
        bio: t("team.bio1"),
        image: "/images/team/Asen%20Tsonev.webp",
      },
      {
        name: t("team.name2"),
        role: t("team.role2"),
        bio: t("team.bio2"),
        image: "/images/team/Ekaterina%20Delcheva.webp",
      },
      {
        name: t("team.name3"),
        role: t("team.role3"),
        bio: t("team.bio3"),
        image: "/images/team/Elena%20Petrova.webp",
      },
      {
        name: t("team.name4"),
        role: t("team.role4"),
        bio: t("team.bio4"),
        image: "/images/team/Momchil%20Pakyov.webp",
      },
      {
        name: t("team.name5"),
        role: t("team.role5"),
        bio: t("team.bio5"),
        image: "/images/team/Vladimir%20Nikolov.webp",
      },
      {
        name: t("team.name6"),
        role: t("team.role6"),
        bio: t("team.bio6"),
        image: "/images/team/Zdravko_Zdravkov.webp",
      },
      {
        name: t("team.name7"),
        role: t("team.role7"),
        bio: t("team.bio7"),
        image: "/images/team/Emre%20Sakal.webp",
      },
    ],
    [t],
  );

  const safeMembers = useMemo(() => (members.length ? members : []), [members]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [domOffset, setDomOffset] = useState(() => members.length);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalMemberIndex, setModalMemberIndex] = useState<number | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 768) setVisibleCount(1);
      else if (window.innerWidth <= 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const memberIndexForDom = useCallback(
    (index: number) => {
      if (!safeMembers.length) return 0;
      return (
        ((index % safeMembers.length) + safeMembers.length) % safeMembers.length
      );
    },
    [safeMembers.length],
  );

  const slide = useCallback(
    (dir: number) => {
      if (safeMembers.length < 2) return;
      setShouldAnimate(true);
      setDomOffset((prev) => prev + dir);
    },
    [safeMembers.length],
  );

  const slideTo = useCallback(
    (targetIndex: number) => {
      if (!safeMembers.length) return;
      setShouldAnimate(false);
      setDomOffset(safeMembers.length + targetIndex);
    },
    [safeMembers.length],
  );

  const startAuto = useCallback(() => {
    stopAuto();
    if (safeMembers.length < 2 || modalMemberIndex !== null) return;
    autoTimerRef.current = setInterval(() => slide(1), 5000);
  }, [modalMemberIndex, safeMembers.length, slide, stopAuto]);

  const closeModal = useCallback(() => {
    if (modalMemberIndex === null) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsModalClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsModalClosing(false);
      setModalMemberIndex(null);
      startAuto();
    }, 320);
  }, [modalMemberIndex, startAuto]);

  const openModal = useCallback(
    (memberIndex: number) => {
      stopAuto();
      setIsModalClosing(false);
      setModalMemberIndex(memberIndex);
    },
    [stopAuto],
  );

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  useEffect(() => {
    if (!safeMembers.length) return;
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (domOffset >= safeMembers.length * 2) {
        setShouldAnimate(false);
        setDomOffset((prev) => prev - safeMembers.length);
      } else if (domOffset < safeMembers.length) {
        setShouldAnimate(false);
        setDomOffset((prev) => prev + safeMembers.length);
      }
    }, 560);
    return () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, [domOffset, safeMembers.length]);

  useEffect(() => {
    if (shouldAnimate) return;
    const timer = setTimeout(() => setShouldAnimate(true), 0);
    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  useEffect(() => {
    if (modalMemberIndex === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalMemberIndex]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalMemberIndex !== null) closeModal();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [closeModal, modalMemberIndex]);

  if (!safeMembers.length) return null;

  const realOffset = memberIndexForDom(domOffset);
  const displayMember = safeMembers[hoveredIndex ?? realOffset];
  const tripledMembers = [...safeMembers, ...safeMembers, ...safeMembers];
  const translateX = -(domOffset * (100 / visibleCount));

  return (
    <>
      <div
        className="team-showcase reveal-up"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div className="team-info-box">
          <span className="showcase-tag">{t("org.tag")}</span>
          <div className="showcase-text">
            <span className="showcase-role">{displayMember.role}</span>
            <h3 className="showcase-name">{displayMember.name}</h3>
          </div>
          <div className="showcase-nav">
            <button
              type="button"
              className="showcase-view-btn"
              onClick={() => openModal(realOffset)}
            >
              {t("view.profile.btn")}
            </button>
            <div className="showcase-nav-buttons">
              <button
                className="carousel-arrow carousel-prev"
                onClick={() => slide(-1)}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="carousel-arrow carousel-next"
                onClick={() => slide(1)}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="team-carousel-outer">
          <div
            className="team-carousel"
            style={{
              transform: `translateX(${translateX}%)`,
              transition: shouldAnimate ? undefined : "none",
            }}
          >
            {tripledMembers.map((member, index) => {
              const memberIndex = memberIndexForDom(index);
              return (
                <div
                  className={`team-carousel-item ${index === domOffset ? "active" : ""}`}
                  key={`${member.name}-${index}`}
                  onMouseEnter={() => setHoveredIndex(memberIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img src={member.image} alt={member.name} />
                  <div className="carousel-overlay">
                    <button
                      type="button"
                      className="carousel-view-btn"
                      onClick={() => openModal(memberIndex)}
                    >
                      {t("view.profile.btn")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="team-thumbnails">
          {safeMembers.map((member, index) => (
            <div
              key={`${member.name}-thumb`}
              className={`team-thumb ${index === realOffset ? "active" : ""}`}
              onClick={() => slideTo(index)}
            >
              <img src={member.image} alt={member.name} />
            </div>
          ))}
        </div>
      </div>
      <div
        className={`team-modal-backdrop ${modalMemberIndex !== null ? "active" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div
          className={`team-modal ${modalMemberIndex !== null && !isModalClosing ? "is-open" : ""} ${isModalClosing ? "is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalName"
        >
          <button
            className="modal-close"
            onClick={closeModal}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="modal-photo-wrap">
            <img
              className="modal-photo"
              src={
                modalMemberIndex !== null
                  ? safeMembers[modalMemberIndex].image
                  : undefined
              }
              alt={
                modalMemberIndex !== null
                  ? safeMembers[modalMemberIndex].name
                  : ""
              }
            />
          </div>
          <div className="modal-body">
            <span className="modal-role">
              {modalMemberIndex !== null
                ? safeMembers[modalMemberIndex].role
                : ""}
            </span>
            <h2 className="modal-name" id="modalName">
              {modalMemberIndex !== null
                ? safeMembers[modalMemberIndex].name
                : ""}
            </h2>
            <p className="modal-bio">
              {modalMemberIndex !== null
                ? safeMembers[modalMemberIndex].bio
                : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
