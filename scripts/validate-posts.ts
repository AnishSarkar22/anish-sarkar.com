import fs from 'fs';
import path from 'path';

console.log('🔍 Validating blog posts...');

const postsDir = path.join(process.cwd(), 'posts');

// Check if posts directory exists
if (!fs.existsSync(postsDir)) {
  console.error('❌ Posts directory not found at:', postsDir);
  console.error('   Please create a "posts" directory in your project root');
  process.exit(1);
}

// Get all markdown files
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  console.error('❌ No markdown files found in posts directory');
  process.exit(1);
}

console.log(`📝 Found ${files.length} blog posts:`);
files.forEach(file => console.log(`   - ${file}`));

// Validate each file
let hasErrors = false;

files.forEach(file => {
  try {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has frontmatter
    if (!content.startsWith('---')) {
      console.error(`❌ ${file}: Missing frontmatter (should start with ---)`);
      hasErrors = true;
      return;
    }
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
    if (!frontmatterMatch) {
      console.error(`❌ ${file}: Invalid frontmatter format`);
      hasErrors = true;
      return;
    }
    
    const frontmatter = frontmatterMatch[1];
    const lines = frontmatter.trim().split('\n');
    const metadata: Record<string, string> = {};
    
    // Parse frontmatter
    lines.forEach(line => {
      const [key, ...values] = line.split(': ');
      if (key && values.length > 0) {
        let value = values.join(': ').trim();
        value = value.replace(/^['"](.*)['"]$/, '$1');
        metadata[key.trim()] = value;
      }
    });
    
    // Required fields validation
    const requiredFields = ['title', 'description', 'date'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    
    if (missingFields.length > 0) {
      console.error(`❌ ${file}: Missing required fields: ${missingFields.join(', ')}`);
      hasErrors = true;
      return;
    }
    
    // Validate date format
    const dateStr = metadata.date;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error(`❌ ${file}: Invalid date format: ${dateStr}`);
      hasErrors = true;
      return;
    }
    
    console.log(`✅ ${file}: Valid`);
    
  } catch (error: any) {
    console.error(`❌ ${file}: Error reading file -`, error.message);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Validation failed! Please fix the errors above.');
  process.exit(1);
}

console.log('\n✅ All blog posts validated successfully!');
console.log('🚀 Ready to build...');