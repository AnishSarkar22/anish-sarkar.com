interface GitHubContributionDay {
    contributionCount: number;
    date: string;
    contributionLevel: number;
  }
  
  interface GitHubContributionWeek {
    contributionDays: GitHubContributionDay[];
  }
  
  interface GitHubContributionCalendar {
    totalContributions: number;
    weeks: GitHubContributionWeek[];
  }
  
  interface GitHubApiResponse {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: GitHubContributionCalendar;
        };
      };
    };
  }
  
  export async function fetchGitHubContributions(username: string, token?: string) {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;
  
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });
  
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
  
    const result: GitHubApiResponse = await response.json();
    
    if (!result.data?.user) {
      throw new Error('User not found');
    }
  
    return result.data.user.contributionsCollection.contributionCalendar;
  }
  