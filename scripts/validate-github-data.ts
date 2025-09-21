const fs = require('node:fs');
const https = require('node:https');

// Configuration
const GIST_URL = 'https://gist.githubusercontent.com/AnishSarkar22/cf0566a554aa75cbe8fad5e39930958d/raw/contributions.json';
const MAX_AGE_HOURS = 48;

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  weeks: ContributionWeek[];
  totalContributions: number;
}

interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

interface UserData {
  user: {
    contributionsCollection: ContributionsCollection;
  };
}

interface GistData {
  data: UserData;
}

function fetchGistData(): Promise<GistData> {
  return new Promise((resolve, reject) => {
    https.get(GIST_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`HTTP request failed: ${error.message}`));
    });
  });
}

async function validateGitHubData() {
  try {
    console.log('🔍 Fetching GitHub contributions data...');
    
    // Fetch data from Gist
    const data = await fetchGistData();
    
    // Validate top-level structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data: Not an object');
    }

    // Check for GraphQL response structure
    if (!data.data || !data.data.user || !data.data.user.contributionsCollection) {
      throw new Error('Invalid data structure: Missing GraphQL response structure');
    }

    const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar;
    
    // Validate contribution calendar structure
    if (!contributionCalendar || typeof contributionCalendar !== 'object') {
      throw new Error('Invalid data: Missing contributionCalendar');
    }

    // Validate weeks array
    if (!contributionCalendar.weeks || !Array.isArray(contributionCalendar.weeks)) {
      throw new Error('Invalid data structure: weeks is not an array');
    }

    if (contributionCalendar.weeks.length === 0) {
      throw new Error('Invalid data: weeks array is empty');
    }

    // Validate totalContributions
    if (typeof contributionCalendar.totalContributions !== 'number') {
      throw new Error('Invalid data: totalContributions is not a number');
    }

    // Validate week structure
    const firstWeek = contributionCalendar.weeks[0];
    if (!firstWeek.contributionDays || !Array.isArray(firstWeek.contributionDays)) {
      throw new Error('Invalid data structure: contributionDays is not an array');
    }

    // Validate day structure
    const firstDay = firstWeek.contributionDays[0];
    if (!firstDay.date || typeof firstDay.contributionCount !== 'number') {
      throw new Error('Invalid data structure: Missing required day fields');
    }

    // Validate data freshness (check if we have recent dates)
    const allDays = contributionCalendar.weeks.flatMap(week => week.contributionDays);
    const latestDate = new Date(Math.max(...allDays.map(day => new Date(day.date).getTime())));
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) {
      console.warn(`⚠️  Data may be stale: Latest date is ${daysDiff} days old`);
    }

    // Validate reasonable data ranges
    if (contributionCalendar.totalContributions < 0 || contributionCalendar.totalContributions > 10000) {
      console.warn(`⚠️  Unusual total contributions: ${contributionCalendar.totalContributions}`);
    }

    // Check for expected number of weeks (approximately 52-53 weeks)
    if (contributionCalendar.weeks.length < 50 || contributionCalendar.weeks.length > 55) {
      console.warn(`⚠️  Unexpected number of weeks: ${contributionCalendar.weeks.length}`);
    }

    // Validate that we have data for 7 days per week
    const invalidWeeks = contributionCalendar.weeks.filter(week => 
      !week.contributionDays || week.contributionDays.length !== 7
    );
    
    if (invalidWeeks.length > 0) {
      throw new Error(`Invalid data: ${invalidWeeks.length} weeks don't have 7 days`);
    }

    // Calculate some stats for validation
    const totalDays = allDays.length;
    const daysWithContributions = allDays.filter(day => day.contributionCount > 0).length;
    const averageContributions = contributionCalendar.totalContributions / totalDays;

    console.log('📊 Data Statistics:');
    console.log(`   Total days: ${totalDays}`);
    console.log(`   Days with contributions: ${daysWithContributions}`);
    console.log(`   Total contributions: ${contributionCalendar.totalContributions}`);
    console.log(`   Average contributions per day: ${averageContributions.toFixed(2)}`);
    console.log(`   Latest date: ${latestDate.toDateString()}`);
    console.log(`   Data age: ${daysDiff} days`);

    console.log('✅ GitHub contributions data validation passed!');
    return true;
    
  } catch (error) {
    console.error('❌ GitHub contributions data validation failed:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// Also validate local file if it exists (for CI environments)
async function validateLocalFile() {
  try {
    if (fs.existsSync('contributions.json')) {
      console.log('📁 Validating local contributions.json file...');
      
      const localData = JSON.parse(fs.readFileSync('contributions.json', 'utf8'));
      
      // Same validation as above but for local file
      if (!localData.data?.user?.contributionsCollection?.contributionCalendar) {
        throw new Error('Local file has invalid structure');
      }
      
      console.log('✅ Local contributions.json validation passed!');
      return true;
    }
      console.log('ℹ️  No local contributions.json file found (this is normal for remote validation)');
      return true;
  } catch (error) {
    console.error('❌ Local file validation failed:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting GitHub contributions data validation...\n');
  
  const gistValid = await validateGitHubData();
  const localValid = await validateLocalFile();
  
  if (gistValid && localValid) {
    console.log('\n🎉 All validations passed successfully!');
    process.exit(0);
  } else {
    console.log('\n💥 Validation failed!');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateGitHubData,
  validateLocalFile
};