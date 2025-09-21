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
		// Don't return mock data - let the component handle the error
		throw error;
	}
}

// export async function fetchGitHubContributions() {
//   try {
//     // Replace with your actual gist ID
//     const response = await fetch(
//       'https://gist.githubusercontent.com/AnishSarkar22/YOUR_ACTUAL_GIST_ID/raw/contributions.json',
//       {
//         next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
//         headers: {
//           'Accept': 'application/json',
//         }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch contributions data: ${response.status}`);
//     }

//     const data = await response.json();

//     // Handle the response structure
//     if (data.data?.user?.contributionsCollection?.contributionCalendar) {
//       return data.data.user.contributionsCollection.contributionCalendar;
//     }

//     // If the structure is different, log it for debugging
//     console.log('Unexpected data structure:', data);
//     throw new Error('Invalid data structure received');

//   } catch (error) {
//     console.error('Error fetching contributions:', error);
//     throw error;
//   }
// }
