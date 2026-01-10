import fs from 'fs';
import path from 'path';

// Files to update with their respective replacements
const filesToUpdate = [
    {
        file: 'src/pages/Projects.jsx',
        replacements: [
            {
                search: "await fetch('http://localhost:3001/api/send-project-selection-email',",
                replace: "await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-project-selection-email`,"
            }
        ]
    },
    {
        file: 'src/pages/ProjectPage.jsx',
        replacements: [
            {
                search: "await fetch('http://localhost:3001/api/send-project-confirmation-email',",
                replace: "await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-project-confirmation-email`,"
            },
            {
                search: "const response = await fetch('http://localhost:3001/api/send-milestone-submitted-email',",
                replace: "const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-milestone-submitted-email`,"
            }
        ]
    },
    {
        file: 'src/pages/ProfileSetup.jsx',
        replacements: [
            {
                search: "await fetch('http://localhost:3001/api/send-welcome-email',",
                replace: "await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-welcome-email`,"
            }
        ]
    },
    {
        file: 'src/pages/Dashboard.jsx',
        replacements: [
            {
                search: "const response = await fetch('http://localhost:3001/api/send-milestone-verified-email',",
                replace: "const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-milestone-verified-email`,"
            },
            {
                search: "const response = await fetch('http://localhost:3001/api/send-milestone-flagged-email',",
                replace: "const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-milestone-flagged-email`,"
            },
            {
                search: "const response = await fetch('http://localhost:3001/api/send-milestone-rejected-email',",
                replace: "const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-milestone-rejected-email`,"
            }
        ]
    }
];

console.log('🔧 Updating API URLs for Vercel deployment...\n');

let totalUpdates = 0;
const errors = [];

filesToUpdate.forEach(({ file, replacements }) => {
    const filePath = path.join(process.cwd(), file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileUpdated = false;

        // Add import if not present
        if (!content.includes("import { EMAIL_CONFIG } from '../config/email'")) {
            // Find the last import statement
            const lines = content.split('\n');
            let lastImportIndex = -1;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ')) {
                    lastImportIndex = i;
                }
            }

            if (lastImportIndex !== -1) {
                lines.splice(lastImportIndex + 1, 0, "import { EMAIL_CONFIG } from '../config/email';");
                content = lines.join('\n');
                fileUpdated = true;
                console.log(`✅ Added EMAIL_CONFIG import to ${file}`);
            }
        }

        // Apply replacements
        replacements.forEach(({ search, replace }) => {
            if (content.includes(search)) {
                content = content.replace(search, replace);
                fileUpdated = true;
                totalUpdates++;
                console.log(`✅ Updated URL in ${file}`);
            }
        });

        if (fileUpdated) {
            fs.writeFileSync(filePath, content, 'utf8');
        }

    } catch (error) {
        errors.push({ file, error: error.message });
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log(`\n📊 Summary:`);
console.log(`   Total URL updates: ${totalUpdates}`);
console.log(`   Errors: ${errors.length}`);

if (errors.length === 0) {
    console.log('\n✨ All files updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test locally: npm run dev:all');
    console.log('   2. Deploy to Vercel: vercel --prod');
} else {
    console.log('\n⚠️  Some files had errors. Please check and update manually.');
}
