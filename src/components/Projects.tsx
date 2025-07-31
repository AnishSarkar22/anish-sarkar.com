export type Project = {
  title: string;
  description: string;
  link: string;
  technologies: string[];
  featured?: boolean;
};

export const projectList: Project[] = [
  {
    title: "Loopr",
    description: "Intelligent URL & API Monitoring, Webhook Scheduling & Uptime Service.",
    link: "https://loopr-pi.vercel.app",
    technologies: ["Svelte", "Docker", "Sveltekit", "Appwrite"],
    featured: true
  },
  {
    title: "Farmalyze",
    description: "A smart farming assistant that leverages AI to provide crop recommendations, fertilizer suggestions, and disease detection through image analysis.",
    link: "https://farmalyze-snowy.vercel.app",
    technologies: ["React", "Flask", "NumPy", "Pandas", "PyTorch", "Supabase", "scikit-learn"],
    featured: true
  },
  {
    title: "NBGA Optimization",
    description: "Optimization algorithms and tools for solving the Traveling Salesman Problem (TSP) and ligand optimization, with datasets and interactive visualizations.",
    link: "https://genetic-optimization.streamlit.app",
    technologies: ["Python", "NumPy", "Matplotlib", "Streamlit"],
  },
  {
    title: "GuideMe",
    description: "Platform that matches mentors and mentees, enabling skill-building and career growth through smart features and easy communication",
    link: "https://github.com/AnishSarkar22/SIH-2024",
    technologies: ["React Native", "Socket.io", "Express", "PostgreSQL", "AWS"],
  },
];