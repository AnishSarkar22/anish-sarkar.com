export async function fetchGitHubContributions() {
	try {
		// Fetch from my public gist
		const response = await fetch(
			"https://gist.githubusercontent.com/AnishSarkar22/cf0566a554aa75cbe8fad5e39930958d/raw/contributions.json",
			{
				next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch contributions data");
		}

		const data = await response.json();
		return data.data.user.contributionsCollection.contributionCalendar;
	} catch (error) {
		console.error("Error fetching contributions:", error);
		// we shouldnt return mock data - let the component handle the error
		throw error;
	}
}
