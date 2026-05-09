let students = [];
let printBtn = null;

// Error Boundary Handler
window.onerror = function(message, source, lineno, colno, error) {
    showErrorBoundary(message);
    return true;
};

window.onunhandledrejection = function(event) {
    showErrorBoundary(event.reason);
};

function showErrorBoundary(err) {
    const boundary = document.getElementById("errorBoundary");
    const message = document.getElementById("errorMessage");
    if (boundary) {
        boundary.style.display = "flex";
        if (message) {
            message.textContent = err?.message || err || "Unknown Error";
        }
    }
}
let exportBtn = null;
let shareBtn = null;
let searchBtn = null;
let totalStudentsElem = null;
let searchesToday = parseInt(localStorage.getItem('searchesToday') || '0');

function checkAndResetSearches() {
    const lastSearchDate = localStorage.getItem('lastSearchDate');
    const today = new Date().toDateString();
    
    if (lastSearchDate !== today) {
        searchesToday = 0;
        localStorage.setItem('searchesToday', '0');
        localStorage.setItem('lastSearchDate', today);
    }
}
checkAndResetSearches();

window.addEventListener('load', function () {
    console.log("Window loaded - Initializing...");
    
    // Initialize elements with null checks
    printBtn = document.getElementById("printBtn");
    exportBtn = document.getElementById("exportBtn");
    shareBtn = document.getElementById("shareBtn");
    searchBtn = document.getElementById("searchBtn");
    totalStudentsElem = document.getElementById("totalStudents");
    
    const checkResultBtn = document.getElementById("checkResultBtn");
    
    // Load CSV data if students array is empty and we are on a page that needs it
    if (students.length === 0 && (searchBtn || totalStudentsElem || checkResultBtn)) {
        loadStudentData();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Show initial stats (especially search count from localStorage)
    updateStats();
});

// Toast Notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} toast-icon"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Load Student Data
function loadStudentData() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbsQi30Tfe2b0gtWfzna889a38opX5W7-44XYPRznUA31Frh86XitheJ8RncRZ83hGKL-cRSmh-IwZ/pub?gid=890097051&single=true&output=csv";
    
    showLoading(true);
    console.log("Loading CSV data from:", csvUrl);
    
    fetch(csvUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            console.log("CSV data received, length:", data.length);
            parseCSVData(data);
        })
        .catch(err => {
            console.error("❌ CSV Load Error:", err);
            showLoading(false);
            showToast("Failed to load student data. Please check your connection.", 'error');
            
            // Fallback: Load sample data for testing
            loadSampleData();
        });
}

function parseCSVData(data) {
    try {
        students = []; // Clear previous data
        
        const lines = data.trim().split("\n");
        console.log("Total lines in CSV:", lines.length);
        
        if (lines.length === 0) {
            throw new Error("Empty CSV file");
        }
        
        // Handle different CSV formats (comma, semicolon, tab)
        const firstLine = lines[0];
        let delimiter = ',';
        
        if (firstLine.includes(';') && !firstLine.includes(',')) {
            delimiter = ';';
        } else if (firstLine.includes('\t')) {
            delimiter = '\t';
        }
        
        console.log("Detected delimiter:", delimiter);
        
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
        console.log("Headers found:", headers);
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Handle quoted fields with commas
            let row = [];
            let inQuotes = false;
            let currentField = '';
            
            for (let char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === delimiter && !inQuotes) {
                    row.push(currentField.trim().replace(/"/g, ''));
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            row.push(currentField.trim().replace(/"/g, ''));
            
            // Ensure row has same length as headers
            if (row.length < headers.length) {
                row = row.concat(new Array(headers.length - row.length).fill(''));
            } else if (row.length > headers.length) {
                row = row.slice(0, headers.length);
            }
            
            let student = {};
            headers.forEach((header, index) => {
                student[header] = row[index] || '';
            });
            
            students.push(student);
        }
        
        console.log(`✅ Successfully parsed ${students.length} student records`);
        console.log("First student:", students[0]);
        
        showLoading(false);
        updateStats();
        setupSuggestionListener();
        showToast(`Successfully loaded ${students.length} student records`, 'success');
        
    } catch (error) {
        console.error("❌ CSV Parsing Error:", error);
        showLoading(false);
        showToast("Error parsing student data", 'error');
        
        // Fallback to sample data
        loadSampleData();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchBtn");
    
    if (searchInput) {
        // Enter key support
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                searchStudent();
            }
        });
        
        // Input for suggestions
        searchInput.addEventListener("input", function() {
            updateSuggestions(this.value);
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener("click", searchStudent);
    }
}

// Loading Animation
function showLoading(show) {
    const loading = document.getElementById("loading");
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// Update Statistics
function updateStats() {
    if (totalStudentsElem) {
        totalStudentsElem.textContent = students.length;
    }
    
    const searchesTodayElem = document.getElementById("searchesToday");
    if (searchesTodayElem) {
        searchesTodayElem.textContent = searchesToday;
    }
}

// Enhanced Search Function
function searchStudent() {
    const query = document.getElementById("searchInput").value.trim();
    const resultBox = document.getElementById("result");
    const resultsSection = document.getElementById("resultsSection");
    const resultCount = document.getElementById("resultCount");
    
    console.log("Searching for:", query);
    
    if (!query) {
        showToast("Please enter a roll number or name", 'warning');
        return;
    }
    
    // Update search count
    searchesToday++;
    localStorage.setItem('searchesToday', searchesToday.toString());
    updateStats();
    
    showLoading(true);
    if (resultsSection) resultsSection.style.display = 'none';
    if (resultBox) resultBox.innerHTML = '';
    
    setTimeout(() => {
        const matched = students.filter(s => {
            const rollMatch = s["Board Roll"] && s["Board Roll"].toString().toLowerCase() === query.toLowerCase();
            const nameMatch = s["Student Name"] && s["Student Name"].toString().toLowerCase().includes(query.toLowerCase());
            return rollMatch || nameMatch;
        });
        
        console.log("Matched students:", matched.length);
        
        showLoading(false);
        
        if (matched.length > 0) {
            let output = "";
            
            matched.forEach((student, index) => {
                output += createStudentCard(student, index, matched.length);
            });
            
            if (resultBox) {
                resultBox.innerHTML = output;
            }
            
            if (resultsSection) {
                resultsSection.style.display = 'block';
            }
            
            if (resultCount) {
                resultCount.textContent = `${matched.length} student${matched.length > 1 ? 's' : ''} found`;
            }
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            showToast(`Found ${matched.length} matching student${matched.length > 1 ? 's' : ''}`, 'success');
        } else {
            const noResultsHTML = `
                <div class="no-results" style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666; margin-bottom: 10px;">No Student Found</h3>
                    <p style="color: #888; margin-bottom: 20px;">
                        No student found with: <strong style="color: #4a6fa5;">"${query}"</strong>
                    </p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; max-width: 400px; margin: 0 auto;">
                        <p style="color: #666; margin-bottom: 10px;">
                            <i class="fas fa-lightbulb" style="color: #ffc107;"></i> 
                            <strong>Tips:</strong>
                        </p>
                        <ul style="text-align: left; color: #666; padding-left: 20px;">
                            <li>Enter the complete board roll number</li>
                            <li>Check for any typing mistakes</li>
                            <li>Try searching by student name</li>
                        </ul>
                    </div>
                </div>
            `;
            
            if (resultBox) {
                resultBox.innerHTML = noResultsHTML;
            }
            
            if (resultsSection) {
                resultsSection.style.display = 'block';
            }
            
            if (resultCount) {
                resultCount.textContent = "No students found";
            }
            
            showToast("No student found with the provided information", 'warning');
        }
    }, 500);
}

// Create Student Card with ALL information
function createStudentCard(student, index, total) {
    const isLast = index === total - 1;
    const pageBreakClass = isLast ? "" : " page-break";
    
    // Get ALL fields from student object
    const fields = Object.keys(student);
    console.log("Available fields for student:", fields);
    
    let infoRows = "";
    
    // Display ALL fields (not just predefined ones)
    fields.forEach(field => {
    if (student[field] && student[field].toString().trim() !== "") {
    let value = student[field];
    
    // যদি ফিল্ডটি "Board Roll" হয়, তাহলে তাকে লিঙ্কে পরিণত করো
    if (field === "Board Roll" || field === "Roll") {
    const rollNumber = value.toString().trim();
    value = `<button onclick="showResultPopup('${rollNumber}')" class="view-result-btn">
    <i class="fas fa-poll-h"></i> ${rollNumber} <span class="btn-tag">View Result</span>
    </button>`;
    }
    
    infoRows += `
    <div class="info-item">
    <div class="info-label">
    <i class="fas fa-${getFieldIcon(field)}"></i>
    ${field}
    </div>
    <div class="info-value">${value}</div>
    </div>
    `;
    }
    });
    
    // If no data found in student object
    if (!infoRows) {
        infoRows = `
            <div class="info-item">
                <div class="info-label">
                    <i class="fas fa-exclamation-circle"></i>
                    Information
                </div>
                <div class="info-value" style="color: #dc3545;">
                    No data available for this student
                </div>
            </div>
        `;
    }
    
    return `
        <div class="student-card${pageBreakClass}">
            <div class="student-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0;">
                <h3 style="margin: 0; color: #4a6fa5;">
                    <i class="fas fa-user-graduate"></i> 
                    ${student["Student Name"] || student["Name"] || "Unknown Student"}
                </h3>
                <span class="student-id" style="background: #4a6fa5; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                    <i class="fas fa-id-card"></i> Roll: ${student["Board Roll"] || student["Roll"] || "N/A"}
                </span>
            </div>
            <div class="student-info-grid">
                ${infoRows}
            </div>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ddd; text-align: right; font-size: 0.9rem; color: #666;">
                <i class="fas fa-info-circle"></i> Record ${index + 1} of ${total}
            </div>
        </div>
    `;
}

// Get icon for any field
function getFieldIcon(field) {
    const fieldLower = field.toLowerCase();
    
    const iconMap = {
        // Names
        'name': 'user',
        'student': 'user',
        'father': 'male',
        'mother': 'female',
        
        // Contact
        'Emergency Contact Number': 'phone',
        'mobile': 'mobile-alt',
        'email': 'envelope',
        'address': 'map-marker-alt',
        'location': 'map-marker',
        
        // Academic
        'roll': 'id-card',
        'registration': 'hashtag',
        'id': 'fingerprint',
        'session': 'calendar',
        'year': 'calendar-alt',
        'department': 'building',
        'dept': 'building',
        'shift': 'clock',
        'time': 'clock',
        'semester': 'layer-group',
        'sem': 'layer-group',
        'group': 'users',
        'section': 'users',
        'class': 'chalkboard-teacher',
        'course': 'book',
        'subject': 'book-open',
        
        // Scores and Grades
        'mark': 'chart-line',
        'score': 'chart-bar',
        'grade': 'award',
        'result': 'clipboard-check',
        'percentage': 'percentage',
        'gpa': 'star',
        'cgpa': 'stars',
        
        // Dates
        'date': 'calendar',
        'birth': 'birthday-cake',
        'dob': 'birthday-cake',
        'admission': 'user-plus',
        
        // Financial
        'fee': 'money-bill-wave',
        'payment': 'credit-card',
        'due': 'exclamation-circle',
        
        // Other
        'gender': 'venus-mars',
        'age': 'birthday-cake',
        'blood': 'tint',
        'Blood Group': 'tint',
        'nationality': 'flag',
        'religion': 'pray',
        'status': 'check-circle'
    };
    
    // Check for matching keywords
    for (const [keyword, icon] of Object.entries(iconMap)) {
        if (fieldLower.includes(keyword)) {
            return icon;
        }
    }
    
    return "info-circle"; // Default icon
}

// Enhanced Suggestions
function setupSuggestionListener() {
    const input = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("suggestions");
    
    if (!input || !suggestionBox) {
        console.error("Suggestions elements not found");
        return;
    }
    
    input.addEventListener("focus", function() {
        if (this.value.trim()) {
            updateSuggestions(this.value);
        }
    });
    
    input.addEventListener("input", function() {
        updateSuggestions(this.value);
    });
}

function updateSuggestions(query) {
    const suggestionBox = document.getElementById("suggestions");
    if (!suggestionBox) return;
    
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";
    
    if (!query || query.length < 2 || students.length === 0) {
        return;
    }
    
    const matched = students.filter(s => {
        const roll = s["Board Roll"] || s["Roll"] || "";
        const name = s["Student Name"] || s["Name"] || "";
        
        return roll.toString().toLowerCase().includes(query.toLowerCase()) ||
               name.toString().toLowerCase().includes(query.toLowerCase());
    }).slice(0, 5);
    
    if (matched.length > 0) {
        matched.forEach(student => {
            const li = document.createElement("div");
            li.className = "suggestion-item";
            
            const name = student["Student Name"] || student["Name"] || "";
            const roll = student["Board Roll"] || student["Roll"] || "";
            
            // Highlight matching text
            const highlightText = (text, queryText) => {
                if (!queryText || !text) return text;
                const escapedQuery = queryText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                return text.toString().replace(regex, '<span class="suggestion-highlight">$1</span>');
            };
            
            li.innerHTML = `
                <i class="fas fa-user-graduate suggestion-icon"></i>
                <div class="suggestion-text">
                    <div class="suggestion-name">${highlightText(name, query) || 'Unknown'}</div>
                    <div class="suggestion-roll">Roll: ${highlightText(roll.toString(), query) || 'N/A'}</div>
                </div>
                <i class="fas fa-chevron-right" style="color: #ccc;"></i>
            `;
            
            li.addEventListener("click", () => {
                const searchInput = document.getElementById("searchInput");
                if (searchInput) {
                    searchInput.value = roll || name;
                    suggestionBox.style.display = "none";
                    searchStudent();
                }
            });
            
            suggestionBox.appendChild(li);
        });
        
        suggestionBox.style.display = "block";
    }
}

// Close suggestions when clicking outside
document.addEventListener("click", function(e) {
    const input = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("suggestions");
    
    if (input && suggestionBox && 
        !input.contains(e.target) && 
        !suggestionBox.contains(e.target)) {
        suggestionBox.style.display = "none";
    }
});

// Enhanced Print Function
function printResult() {
    const content = document.getElementById("result").innerHTML;
    const studentName = document.querySelector(".student-header h3")?.textContent || "Student";
    
    const win = window.open("", "_blank", "width=900,height=800");
    
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Information - ${studentName}</title>
            <style>
                @page { 
                    size: A4; 
                    margin: 20mm; 
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .print-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #4a6fa5;
                }
                .print-header h1 {
                    color: #4a6fa5;
                    margin: 0 0 10px 0;
                }
                .print-header p {
                    color: #666;
                    margin: 0;
                }
                .student-info {
                    margin-bottom: 30px;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 10px;
                    padding: 8px 0;
                    border-bottom: 1px dashed #ddd;
                }
                .info-label {
                    font-weight: 600;
                    color: #4a6fa5;
                    width: 200px;
                    flex-shrink: 0;
                }
                .info-value {
                    flex: 1;
                }
                .print-footer {
                    text-align: center;
                    margin-top: 40px;
                    color: #666;
                    font-size: 14px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                }
                .signature {
                    margin-top: 40px;
                    text-align: right;
                }
                .signature-line {
                    width: 200px;
                    border-top: 1px solid #333;
                    margin: 20px 0 5px auto;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .page-break { 
                        page-break-after: always; 
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>DPI Student Information Portal</h1>
                <p>Official Academic Record - Generated on ${new Date().toLocaleDateString('en-BD')}</p>
            </div>
            <div class="student-info">
                ${content}
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <p><strong>Authorized Signature</strong></p>
                <p>DPI Administration</p>
            </div>
            <div class="print-footer">
                <p>This document was generated automatically by DPI Student Portal</p>
                <p>© 2025 Dhaka Polytechnic Institute. All rights reserved.</p>
                <p style="font-size: 12px; color: #999;">
                    Developer: Oahid Towsif Shamol | &copy; 249
                </p>
            </div>
            <script>
                // Auto print after load
                setTimeout(() => {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                }, 500);
            </script>
        </body>
        </html>
    `);
    
    win.document.close();
    showToast("Print dialog opened", 'success');
}

// Export as Image
function exportAsImage() {
    const element = document.getElementById("result");
    
    if (!element || element.innerHTML.trim() === '') {
        showToast("No data to export", 'warning');
        return;
    }
    
    showToast("Creating image... Please wait", 'info');
    
    html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        const studentName = document.querySelector(".student-header h3")?.textContent || 'student';
        const fileName = `DPI_Student_${studentName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast("Image downloaded successfully!", 'success');
    }).catch(err => {
        console.error("Export error:", err);
        showToast("Failed to export image", 'error');
    });
}

// Share Result
function shareResult() {
    const studentName = document.querySelector(".student-header h3")?.textContent || "Student Information";
    
    if (navigator.share) {
        navigator.share({
            title: `DPI Student: ${studentName}`,
            text: `Check out ${studentName}'s information from DPI Student Portal`,
            url: window.location.href
        }).then(() => {
            showToast("Shared successfully", 'success');
        }).catch(err => {
            console.error("Share error:", err);
            showToast("Sharing cancelled", 'info');
        });
    } else {
        // Fallback: Copy to clipboard
        const text = `DPI Student Information - ${studentName}\n${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast("Link copied to clipboard", 'success');
        }).catch(err => {
            console.error("Copy error:", err);
            showToast("Failed to copy link", 'error');
        });
    }
}

// Result Popup Functions
async function showResultPopup(roll) {
    const popup = document.getElementById("resultPopup");
    const body = document.getElementById("resultPopupBody");
    
    if (!popup || !body) return;
    
    popup.style.display = "flex";
    body.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p>Fetching results for roll: ${roll}...</p>
        </div>
    `;
    
    try {
        const apiUrl = `/api/results?roll=${roll}&curriculumId=diploma_in_engineering`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            const data = result.data[0];
            body.innerHTML = renderResultData(data);
        } else {
            body.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>No Result Found</h3>
                    <p>Could not find academic results for roll: <strong>${roll}</strong></p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Result Fetch Error:", error);
        body.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fas fa-wifi" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>Connection Error</h3>
                <p>Failed to fetch results. Please try again later.</p>
            </div>
        `;
    }
}

function closeResultPopup() {
    const popup = document.getElementById("resultPopup");
    if (popup) {
        popup.style.display = "none";
    }
}

function renderResultData(data) {
    const studentName = students.find(s => (s["Board Roll"] || s["Roll"]) == data.roll)?.["Student Name"] || "Towsif";
    
    let summaryBox = "";
    if (data.currentFailedSubjects && data.currentFailedSubjects.length > 0) {
        summaryBox = `
            <div class="result-summary-box">
                ${data.currentFailedSubjects.length} subjects yet to pass
            </div>
        `;
    }

    let semesterCards = "";
    
    if (data.semesterResults) {
        data.semesterResults.forEach(sem => {
            let primaryResult = (sem.results && sem.results.length > 0) ? sem.results[0] : null;
            if (primaryResult && sem.results.length > 1) {
                for (let i = 1; i < sem.results.length; i++) {
                    const currentRes = sem.results[i];
                    if (!currentRes) continue;
                    if (sem.status === "passed") {
                        if (currentRes.gpa === primaryResult.gpa) primaryResult = currentRes;
                    } else if (sem.status === "failed") {
                        const currentFailCount = currentRes.failedSubjects ? currentRes.failedSubjects.filter(s => !s.passed).length : 0;
                        const primaryFailCount = primaryResult.failedSubjects ? primaryResult.failedSubjects.filter(s => !s.passed).length : 0;
                        if (currentFailCount === primaryFailCount) primaryResult = currentRes;
                    }
                }
            }

            const dateStr = primaryResult ? formatDate(primaryResult.date) : "N/A";
            const timeAgoStr = primaryResult ? timeAgo(primaryResult.date) : "";
            
            let statusText = capitalize(sem.status);
            let statusIcon = "fa-check-circle";
            
            if (sem.status === "failed" && primaryResult && primaryResult.failedSubjects) {
                const failCount = primaryResult.failedSubjects.filter(s => !s.passed).length;
                if (failCount > 0) {
                    statusText = `${failCount} subject${failCount > 1 ? 's' : ''}`;
                    statusIcon = "fa-times-circle";
                }
            }

            let resultBody = "";
            
            // Show subject list if available (even for passed semesters)
            if (primaryResult && primaryResult.failedSubjects && primaryResult.failedSubjects.length > 0) {
                let subjectsList = "";
                primaryResult.failedSubjects.forEach(sub => {
                    const originBadge = sub.originSemester && sub.originSemester !== sem.semester ? `<span class="sub-badge">${getOrdinal(sub.originSemester)}</span>` : "";
                    const typeBadge = sub.type ? `<span class="sub-badge">${sub.type === 'T' ? 'Theory' : 'Practical'}</span>` : "";
                    const nameClass = sub.passed ? 'sub-passed-name' : '';
                    const rowClass = sub.passed ? 'row-passed' : 'row-failed';
                    
                    subjectsList += `
                        <div class="subject-row ${rowClass}">
                            <span class="sub-code">${sub.subCode}</span>
                            <span class="sub-name ${nameClass}">${sub.subName}</span>
                            ${originBadge}
                            ${typeBadge}
                        </div>
                    `;
                });
                
                resultBody = `<div class="failed-subjects-container">${subjectsList}</div>`;
            } else if (sem.status === "passed" && primaryResult) {
                const republishedBadge = primaryResult.republished ? `<span class="republished-badge">Republished</span>` : "";
                const gpaDisplay = (typeof primaryResult.gpa === 'number') ? primaryResult.gpa.toFixed(2) : "N/A";
                resultBody = `
                    <div class="sem-gpa-box">
                        <span class="gpa-label">GPA ${republishedBadge}</span>
                        <span class="gpa-value">${gpaDisplay}</span>
                    </div>
                `;
            }
            
            semesterCards += `
                <div class="sem-card">
                    <div class="sem-card-top">
                        <div class="sem-title">
                            <i class="fas fa-graduation-cap"></i> ${getOrdinal(sem.semester)} Semester
                        </div>
                        <div class="sem-status status-${sem.status}">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </div>
                    </div>
                    <div class="sem-meta">
                        <div class="meta-item"><i class="far fa-calendar-alt"></i> ${dateStr}</div>
                        ${timeAgoStr ? `<div class="meta-badge">${timeAgoStr}</div>` : ""}
                    </div>
                    ${resultBody}
                </div>
            `;
        });
    }

    return `
        <div class="result-header-modern">
            <h1 class="result-roll"># ${data.roll}</h1>
            <div class="result-student-name">
                <i class="far fa-user"></i> ${studentName}
            </div>
            <div class="result-sub-header">
                <span><i class="fas fa-book-open"></i> Diploma in Engineering</span>
                <span><i class="far fa-calendar-check"></i> Regulation ${data.regulation}</span>
            </div>
            <div class="result-institute">
                <i class="fas fa-university"></i> ${data.institute.name}, ${data.institute.district}
            </div>
            ${summaryBox}
        </div>
        <div class="semester-results-grid">
            ${semesterCards}
        </div>
    `;
}

function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Add CSS for dynamic elements if needed
    const style = document.createElement('style');
    style.textContent = `
        .no-results {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 15px;
            border: 2px dashed #dee2e6;
        }
        
        .student-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .student-info-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});

// Service Worker রেজিস্ট্রেশন
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker রেজিস্ট্রেশন সফল:', registration);
      })
      .catch(error => {
        console.log('Service Worker রেজিস্ট্রেশন ফেইল:', error);
      });
  });
}

// অ্যাপ ইন্সটলেশন বাটন
let deferredPrompt;
const installBtn = document.getElementById('installBtn'); // আপনার বাটনের আইডি

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // ইন্সটল বাটন শো করুন
  if (installBtn) {
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('ইউজার অ্যাপ ইন্সটল করেছে');
        }
        deferredPrompt = null;
      });
    });
  }
});
