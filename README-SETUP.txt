CAMPUSCALS UPDATED
===================

This package contains the cleaned CampusCalc web app with SEO, PWA install UI, updated service worker, sitemap, robots.txt and the new app icon.

IMPORTANT — FIREBASE FEEDBACK
The supplied source code contains the Firebase project ID and other project settings, but the Web API key is still the placeholder YOUR_FIREBASE_API_KEY.

Before deploying, open index.html and replace only:
  apiKey: "YOUR_FIREBASE_API_KEY"
with the Web API key shown in Firebase Console > Project settings > Your apps > Web app configuration.

The app has a safe local feedback fallback until that key is supplied; it will not falsely claim cloud submission.

DEPLOYMENT
1. Upload this folder to the same Git/Vercel project.
2. Make sure index.html is at the project root.
3. Deploy.
4. Open https://campuscalc.vercel.app/ and test the Install App prompt, feedback, GPA/CGPA, profile, assignments, timetable, goals, notes and settings.
5. After deployment, submit https://campuscalc.vercel.app/ to Google Search Console and the sitemap URL https://campuscalc.vercel.app/sitemap.xml.
