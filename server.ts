import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Proxy for btebresultszone API to avoid CORS issues
app.get("/api/results", async (req, res) => {
  const { roll, curriculumId } = req.query;
  const targetUrl = `https://btebresultszone.com/api/student-results?roll=${roll}&curriculumId=${curriculumId || "diploma_in_engineering"}`;
  
  console.log("Fetching result for roll:", roll, "Url:", targetUrl);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout
    
    const response = await fetch(targetUrl, { 
        signal: controller.signal,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
        const errText = await response.text();
        console.error("External API error:", response.status, errText);
        return res.status(response.status).json({ 
            success: false, 
            error: `BTEB Server Error (${response.status})` 
        });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Proxy error:", error);
    const message = error.name === 'AbortError' ? "Request timed out (BTEB server is slow)" : "Failed to connect to BTEB Server";
    res.status(500).json({ success: false, error: message });
  }
});

// Explicit routes for clean URLs
app.get("/result", (req, res) => {
  res.sendFile(path.join(__dirname, "result.html"));
});

// Handle clean URLs based on vercel.json rewrites
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "app.html"));
});

// Generic rewrite for any other extension-less URLs to .html if they exist
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  if (!page.includes(".")) {
    const filePath = path.join(__dirname, `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        next();
      }
    });
  } else {
    next();
  }
});

// Fallback to index.html for unknown routes (SPA behavior if needed)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
