export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/who-we-are", label: "Who we are" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export const services: ServiceItem[] = [
  {
    id: "01",
    title: "Consulting & Advisory",
    description:
      "Every client project begins with a structured architectural assessment aligned with business goals and compliance requirements.",
    bullets: [
      "Infrastructure and architecture assessment",
      "Risk and impact analysis",
      "Capacity planning and scalability modeling",
      "Technology roadmapping",
    ],
  },
  {
    id: "02",
    title: "Virtualization & Data Center",
    description:
      "We design and deploy resilient on-premise and private cloud environments for high availability and performance.",
    bullets: [
      "Enterprise virtualization platforms",
      "High-availability clusters",
      "SAN and NAS storage solutions",
      "Legacy infrastructure modernization",
    ],
  },
  {
    id: "03",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Secure hybrid and cloud environments connecting data centers, cloud platforms, and distributed systems.",
    bullets: [
      "Public cloud architecture design",
      "Cloud migration and multi-cloud integration",
      "Infrastructure as Code",
      "Geo-redundancy and disaster recovery",
    ],
  },
  {
    id: "04",
    title: "Network Architecture & Connectivity",
    description:
      "Our network specialists design enterprise-grade connectivity solutions that enable secure, high-performance communication across distributed environments.",
    bullets: [
      "Layer 2 and Layer 3 network architecture",
      "SD-WAN deployment",
      "Secure VPN and encrypted tunnels",
      "Data Center Interconnect (DCI)",
      "Network segmentation and micro-segmentation",
    ],
  },
  {
    id: "05",
    title: "Backup & Business Continuity",
    description:
      "For mission-critical information, we design resilient data protection and recovery strategies that minimize downtime and ensure continuous operations.",
    bullets: [
      "Multi-layer backup strategies",
      "Immutable backup solutions",
      "Offsite and cloud replication",
      "Disaster Recovery architecture and testing",
      "RPO and RTO definition",
      "Backup encryption and ransomware protection",
      "Periodic disaster recovery simulations",
    ],
  },
  {
    id: "06",
    title: "Security & Compliance",
    description:
      "We implement infrastructure security frameworks designed to protect enterprise systems and support regulatory compliance.",
    bullets: [
      "Identity and Access Management (IAM)",
      "Multi-Factor Authentication (MFA)",
      "Infrastructure hardening",
      "Vulnerability assessments",
      "Network segmentation and zero-trust architecture",
      "Logging and monitoring frameworks",
      "Regulatory audit readiness",
    ],
  },
  {
    id: "07",
    title: "Managed Infrastructure & Operations",
    description:
      "We provide 24/7 enterprise infrastructure support and lifecycle management under structured SLA frameworks.",
    bullets: [
      "24/7 technical support and monitoring",
      "Incident and problem management",
      "On-call engineering teams",
      "Critical incident response",
      "Patch and lifecycle management",
      "Infrastructure performance optimization",
    ],
  },
  {
    id: "08",
    title: "Development & Product Engineering",
    description:
      "We develop enterprise-grade software and integration solutions that enhance operational efficiency and automation.",
    bullets: [
      "Custom enterprise software development",
      "Backend systems and platform integration",
      "API integrations",
      "UI/UX design",
      "Internal systems and automation solutions",
    ],
  },
  {
    id: "09",
    title: "Project & Business Management",
    description:
      "Our project and account management teams ensure structured delivery and long-term client engagement.",
    bullets: [
      "Management of infrastructure and transformation projects",
      "Control of timelines, budget, and risk",
      "Vendor coordination",
      "Acceptance procedures",
      "Strategic client management",
      "Long-term technology planning",
      "Regular review sessions",
      "Environment optimization",
    ],
  },
  {
    id: "10",
    title: "Legal & Regulatory Advisory",
    description:
      "Our legal advisory team provides support in areas related to technology governance and regulatory compliance.",
    bullets: [
      "IT contract advisory",
      "Data protection and GDPR compliance",
      "Preparation for ISO certifications (ISO 9001, ISO 20000-1, ISO 27001, ISO 37001)",
      "Assistance with EU regulatory requirements",
      "Software licensing compliance",
      "Vendor contract structuring and governance",
    ],
  },
];

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  workType: string;
  summary: string;
  applyUrl: string;
  responsibilities: string[];
  requirements: string[];
  offer: string[];
};

export const jobs: Job[] = [
  {
    slug: "office-receptionist",
    title: "Office Receptionist",
    department: "Administration",
    location: "Sofia, Bulgaria",
    workType: "Full-time",
    summary: "Front-desk operations and office administration support.",
    applyUrl: "https://www.jobs.bg/job/8369372",
    responsibilities: [
      "Manage front-desk and visitor communication",
      "Support internal administration workflows",
      "Coordinate office logistics and documentation",
    ],
    requirements: [
      "Strong communication and organizational skills",
      "Comfort working in a fast-paced office environment",
      "Attention to detail and reliability",
    ],
    offer: [
      "Supportive and professional team",
      "Stable long-term position",
      "Opportunities to grow inside the organization",
    ],
  },
  {
    slug: "accountant",
    title: "Accountant",
    department: "Finance",
    location: "Sofia, Bulgaria",
    workType: "Full-time",
    summary: "Accounting and financial operations support.",
    applyUrl: "https://www.jobs.bg/job/8350176",
    responsibilities: [
      "Maintain accounting records and documentation",
      "Prepare periodic financial reports",
      "Support month-end and annual closing activities",
    ],
    requirements: [
      "Experience in accounting and finance operations",
      "Good analytical and organizational skills",
      "Strong attention to detail",
    ],
    offer: [
      "Work on structured enterprise processes",
      "Collaborative cross-functional environment",
      "Competitive compensation package",
    ],
  },
  {
    slug: "hr-associate",
    title: "HR Associate",
    department: "Human Resources",
    location: "Sofia, Bulgaria",
    workType: "Full-time",
    summary: "People operations and hiring process support.",
    applyUrl: "https://www.jobs.bg/job/8381843",
    responsibilities: [
      "Coordinate recruitment and onboarding activities",
      "Support employee records and HR administration",
      "Assist with internal HR initiatives",
    ],
    requirements: [
      "Interest in HR and people operations",
      "Strong communication and coordination skills",
      "Ability to handle confidential information",
    ],
    offer: [
      "Mentorship and growth opportunities",
      "Modern and collaborative work environment",
      "Long-term career development path",
    ],
  },
];
