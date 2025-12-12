export type Project = {
	title: string;
	description: string;
	link?: string;
	githubLink?: string;
	technologies: string[];
	featured?: boolean;
};

export const projectList: Project[] = [
	{
		title: "Loopr",
		description:
			"Intelligent URL & API Monitoring, Webhook Scheduling & Uptime Service.",
		link: "https://loopr.anish-sarkar.com",
		githubLink: "https://github.com/AnishSarkar22/loopr",
		technologies: ["Svelte", "Docker", "Sveltekit", "Appwrite"],
		featured: true,
	},
	{
		title: "Farmalyze",
		description:
			"A smart farming assistant that leverages AI to provide crop recommendations, fertilizer suggestions, and disease detection through image analysis.",
		link: "https://farmalyze.anish-sarkar.com",
		githubLink: "https://github.com/AnishSarkar22/farmalyze",
		technologies: [
			"React",
			"Flask",
			"NumPy",
			"Pandas",
			"PyTorch",
			"SQLite",
			"scikit-learn",
		],
		featured: true,
	},
	{
		title: "NBGA Optimization",
		description:
			"Optimization algorithms and tools for solving the Traveling Salesman Problem (TSP) and ligand optimization, with datasets and interactive visualizations.",
		link: "https://nbga-optimization.streamlit.app",
		githubLink: "https://github.com/AnishSarkar22/nbga-optimization",
		technologies: ["Python", "NumPy", "Matplotlib", "Streamlit"],
	},
	{
		title: "HTTP Server",
		description: "HTTP/1.1 Server from sratch.",
		githubLink: "https://github.com/AnishSarkar22/HTTP-Server",
		technologies: ["Java", "Docker", "Nginx", "HTML", "JUnit"],
	},
	{
		title: "WebRTC Video Call App",
		description: "WebRTC peer-to-peer video call web app",
		githubLink: "https://github.com/AnishSarkar22/WebRTC-Video-Call",
		technologies: [
			"Java",
			"JavaScript",
			"HTML",
			"Docker",
			"netty-socketio",
			"JUnit",
		],
	},
	{
		title: "GuideMe",
		description:
			"Platform that matches mentors and mentees, enabling skill-building and career growth through smart features and easy communication",
		githubLink: "https://github.com/AnishSarkar22/SIH-2024",
		technologies: ["React", "Socket.io", "Express", "PostgreSQL", "AWS"],
	},
	{
		title: "Conway's Game of Life",
		description: "Implementation of infamous Conway's Game of Life",
		link: "https://game-of-life.anish-sarkar.com",
		githubLink: "https://github.com/AnishSarkar22/conways-game-of-life",
		technologies: ["Svelte", "Pygame"],
	},
];
