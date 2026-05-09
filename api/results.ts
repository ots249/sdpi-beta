import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { roll, curriculumId } = req.query;
  
  if (!roll) {
    return res.status(400).json({ success: false, error: "Roll number is required" });
  }

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
}
