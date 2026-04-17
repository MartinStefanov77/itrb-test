"use client";

import { useState } from "react";
import type { ServiceItem } from "./types";

export function ServicesAccordion({ items }: { items: ServiceItem[] }) {
  const [open, setOpen] = useState(items[0]?.id ?? "");

  return (
    <div className="acc-list">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={`acc-item ${isOpen ? "is-open" : ""}`}>
            <button className="acc-trigger" onClick={() => setOpen(isOpen ? "" : item.id)} aria-expanded={isOpen}>
              <div className="acc-trigger-left">
                <span className="acc-num">{item.id}</span>
                <span className="acc-title">{item.title}</span>
              </div>
            </button>
            <div className="acc-body">
              <div className="acc-body-inner">
                <div className="acc-body-content">
                  <p className="svc-desc">{item.description}</p>
                  <ul className="service-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
