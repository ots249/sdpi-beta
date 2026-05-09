import { Student } from '../types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbsQi30Tfe2b0gtWfzna889a38opX5W7-44XYPRznUA31Frh86XitheJ8RncRZ83hGKL-cRSmh-IwZ/pub?gid=890097051&single=true&output=csv";

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    return parseCSV(text);
  } catch (error) {
    console.error("CSV Load Error:", error);
    return [];
  }
};

const parseCSV = (data: string): Student[] => {
  const lines = data.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple split for now, handle quotes if needed properly
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const student: Student = {};
    headers.forEach((header, index) => {
      student[header] = values[index];
    });
    students.push(student);
  }

  return students;
};

export const fetchBTEBResult = async (roll: string) => {
  try {
    // Using the Vercel API proxy we created earlier
    const response = await fetch(`/api/results?roll=${roll}`);
    if (!response.ok) throw new Error("Failed to fetch BTEB result");
    return await response.json();
  } catch (error) {
    console.error("BTEB Result Error:", error);
    throw error;
  }
};
