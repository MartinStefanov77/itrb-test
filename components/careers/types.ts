export type CareersJob = {
  slug: string;
  title: string;
  department: string;
  location: string;
  summary: string;
};

export type CareersData = {
  hero: {
    title: string;
    intro: string;
  };
  filters: {
    departmentLabel: string;
    departmentAllLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
  };
  jobs: CareersJob[];
};
