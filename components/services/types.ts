export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export type ServicesData = {
  hero: {
    title: string;
    intro: string;
  };
  items: ServiceItem[];
};
