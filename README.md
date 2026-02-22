# 🎨 Art Institute of Chicago - Artwork Table

A React + TypeScript application that displays artwork data from the Art Institute of Chicago API using PrimeReact DataTable with:

- Server-side pagination
- Persistent row selection across pages
- Custom row selection overlay
- No data prefetching
- Optimized state management

---

## 🚀 Live Demo

🔗 Deployed URL: https://silver-crepe-a8483a.netlify.app/ 

---

## 🛠️ Tech Stack

- React (Vite)
- TypeScript
- PrimeReact (DataTable, OverlayPanel)
- Node.js
- Netlify (Deployment)

---

## 📡 API Used

Art Institute of Chicago API:

https://api.artic.edu/api/v1/artworks?page=1

---

## ✨ Features

### ✅ Server-Side Pagination
- Data is fetched page-by-page from the API
- No bulk data loading
- Uses PrimeReact `lazy` pagination

### ✅ Persistent Row Selection
- Row selection persists when navigating between pages
- Selection state is stored using artwork IDs only
- No row objects are stored from other pages

### ✅ Select All / Deselect All (Current Page)
- Selects only rows visible on the current page
- Does not affect selections from other pages

### ✅ Custom Row Selection (Overlay Panel)
- User can input a number `n`
- Selects first `n` rows from the current page
- If `n` exceeds page size, only available rows are selected
- No prefetching or extra API calls

---

## ⚠️ Important Implementation Details

To meet assignment constraints:

- Only current page data is stored in memory
- No prefetching of additional pages
- No loop-based API calls
- Only artwork IDs are stored for selection tracking
- Previously visited pages are always re-fetched from API

---

## 📂 Project Structure
