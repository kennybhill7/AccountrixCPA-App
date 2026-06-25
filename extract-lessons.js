const fs = require('fs');
const path = require('path');

// Create main directory
const outputDir = './textbook-lessons';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process all 12 months
for (let monthNum = 1; monthNum <= 12; monthNum++) {
  const monthId = `m${monthNum}`;
  const monthFile = `./data/${monthId}.json`;

  console.log(`\n📖 Processing ${monthId}...`);

  // Read month data
  const monthData = JSON.parse(fs.readFileSync(monthFile, 'utf8'));

  // Create month directory
  const monthDir = path.join(outputDir, `month-${monthNum}`);
  if (!fs.existsSync(monthDir)) {
    fs.mkdirSync(monthDir, { recursive: true });
  }

  // Create month README
  const monthReadme = `# ${monthData.title}\n\n${monthData.description || 'Construction CFO Training Content'}\n\n## Weeks\n\n`;
  const weekLinks = monthData.weeks.map((week, idx) => {
    const weekNum = week.order || (idx + 1);
    return `${weekNum}. [${week.title}](week-${weekNum}.html)`;
  }).join('\n');

  fs.writeFileSync(
    path.join(monthDir, 'README.md'),
    monthReadme + weekLinks,
    'utf8'
  );

  // Extract each week's lesson
  monthData.weeks.forEach((week, idx) => {
    const weekNum = week.order || (idx + 1);
    const weekFile = `week-${weekNum}.html`;
    const weekPath = path.join(monthDir, weekFile);

    // Create complete HTML document
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${week.title} - ${monthData.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.75;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #334155;
      background: #f8fafc;
    }
    h1 {
      color: #1e293b;
      font-size: 2rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 0.5rem;
    }
    h2 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    h3 {
      color: #475569;
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 1rem;
      color: #475569;
    }
    ul, ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    li {
      margin-bottom: 0.5rem;
      color: #475569;
    }
    strong {
      color: #1e293b;
      font-weight: 600;
    }
    em {
      font-style: italic;
    }
    code {
      background: #e2e8f0;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    .cfo-insight {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.25rem;
    }
    .nav-header {
      background: #1e293b;
      color: white;
      padding: 1rem;
      margin: -2rem -2rem 2rem -2rem;
      border-radius: 0.5rem 0.5rem 0 0;
    }
    .nav-header h1 {
      color: white;
      border: none;
      margin: 0;
      padding: 0;
      font-size: 1.5rem;
    }
    .nav-header p {
      color: #cbd5e1;
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="nav-header">
    <h1>${monthData.title}</h1>
    <p>${week.title}</p>
  </div>

  ${week.lessonHtml}

  <hr style="margin: 2rem 0; border: none; border-top: 1px solid #cbd5e1;">
  <p style="text-align: center; color: #94a3b8; font-size: 0.9rem;">
    <strong>Accountrix Construction CFO Training</strong><br>
    ${monthData.title} • ${week.title}
  </p>
</body>
</html>`;

    fs.writeFileSync(weekPath, htmlContent, 'utf8');

    const wordCount = week.lessonHtml.split(/\s+/).length;
    console.log(`  ✅ ${weekFile} (${wordCount.toLocaleString()} words)`);
  });

  console.log(`  📁 Created ${monthData.weeks.length} lesson files in ${monthDir}`);
}

console.log('\n✅ All lessons extracted to textbook-lessons/');
console.log('\n📊 Summary:');
console.log('   • 12 month folders created');
console.log('   • 48 lesson HTML files created');
console.log('   • Each file is a complete, styled HTML document');
console.log('   • Open any .html file in a browser to read');
