import { parse } from 'csv-parse/sync';
import type { TestSession, TestSessionsByName } from '$lib/types';
import { readFileSync } from 'fs';

interface CSVRecord {
  examDate: string;
  examTime: string;
  subject: string;
  grade: string;
  minutes: string;
  classNum: string;
  location: string;
  proctor1: string;
  proctor2: string;
  numOfStudents: string;
  [key: `s${number}`]: string;
}

// Cache for parsed CSV data
let csvCache: CSVRecord[] | null = null;

// Cache for transformed data
const sessionCache = new Map<string, TestSessionsByName>();
const namesCache = new Map<'student' | 'proctor', Set<string>>();

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('/');
    return `${parseInt(month)}/${parseInt(day)}`;
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  try {
    const [start, end] = timeStr.split(/[-–]/).map(t => t.replace(':', ''));
    const formatHour = (time: string) => {
      const paddedTime = time.padStart(4, '0');
      return `${paddedTime.slice(0, 2)}:${paddedTime.slice(2)}`;
    };
    return `${formatHour(start)}--${formatHour(end)}`;
  } catch {
    return timeStr;
  }
}

export function parseCSV(filePath: string): CSVRecord[] {
  if (csvCache !== null) return csvCache;

  const fileContent = readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  }) as CSVRecord[];

  csvCache = records;
  return records;
}

function getStudentsFromRecord(record: CSVRecord): string[] {
  const students: string[] = [];
  for (let i = 1; i <= 48; i++) {
    const student = record[`s${i}`]?.trim();
    if (student) {
      students.push(student);
    }
  }
  return students;
}

function getProctorsFromRecord(record: CSVRecord): string[] {
  const proctors: string[] = [];
  if (record.proctor1?.trim()) proctors.push(record.proctor1.trim());
  if (record.proctor2?.trim()) proctors.push(record.proctor2.trim());
  return proctors;
}

export function getNames(type: 'student' | 'proctor'): string[] {
  // Check cache first
  const cached = namesCache.get(type);
  if (cached) return Array.from(cached);

  const records = parseCSV('input.csv');
  const names = new Set<string>();

  records.forEach(record => {
    if (type === 'student') {
      getStudentsFromRecord(record).forEach(student => names.add(student));
    } else {
      getProctorsFromRecord(record).forEach(proctor => names.add(proctor));
    }
  });

  // Cache the result
  namesCache.set(type, names);
  return Array.from(names);
}

export function getSessionsByName(name: string, type: 'student' | 'proctor'): TestSession[] {
  const cacheKey = `${type}:${name}`;
  
  // Check cache first
  const cached = sessionCache.get(cacheKey);
  if (cached) return cached[name];

  const records = parseCSV('input.csv');
  const sessions: TestSession[] = [];

  records.forEach(record => {
    const items = type === 'student' 
      ? getStudentsFromRecord(record)
      : getProctorsFromRecord(record);
    
    if (items.includes(name)) {
      sessions.push({
        examDate: formatDate(record.examDate),
        examTime: formatTime(record.examTime),
        room: record.location,
        course: `${record.subject} ${record.grade}`,
        students: getStudentsFromRecord(record),
        proctors: getProctorsFromRecord(record)
      });
    }
  });

  // Cache the result
  const result: TestSessionsByName = { [name]: sessions };
  sessionCache.set(cacheKey, result);
  
  return sessions;
}

// Clear caches if memory needs to be freed
export function clearCaches(): void {
  csvCache = null;
  sessionCache.clear();
  namesCache.clear();
} 