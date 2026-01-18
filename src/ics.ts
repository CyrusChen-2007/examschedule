export interface TestSession {
    examDate: string;
    examTime: string;
    subject: string;
    grade: string;
    classNum: string;
    minutes: string;
    location: string;
    proctor1: string;
    proctor2: string | null;
    numOfStudents: string;
    students: string[];
}

export interface CalendarExportOptions {
    calendarName: string;
    timezone?: string;
    uidNamespace?: string;
    includeRoster?: boolean;
}

function pad2(n: number): string {
    const s = String(n);
    return s.length >= 2 ? s : `0${s}`;
}

function icsEscapeText(value: string): string {
    // RFC 5545 text escaping
    return value
        .replace(/\\/g, "\\\\")
        .replace(/\r\n|\n|\r/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,");
}

function foldIcsLine(line: string): string {
    // RFC 5545 line folding: 75 octets recommended; use 75 chars as a practical approximation.
    const limit = 75;
    if (line.length <= limit) return line;

    let out = "";
    let i = 0;
    while (i < line.length) {
        const chunk = line.slice(i, i + limit);
        out += (i === 0 ? chunk : `\r\n ${chunk}`);
        i += limit;
    }
    return out;
}

function normalizeDate(examDate: string): { year: number; month: number; day: number } {
    // Expected input: YYYY.M.D (as observed in generated JSON). Be forgiving.
    const parts = examDate.trim().split(/[./-]/).filter(Boolean);
    if (parts.length < 3) throw new Error(`Unrecognized examDate format: ${examDate}`);
    const [y, m, d] = parts;
    return {
        year: Number(y),
        month: Number(m),
        day: Number(d),
    };
}

function parseExamTime(examTime: string): { startHour: number; startMin: number; endHour: number; endMin: number } {
    // Expected input: "800-1000" (as observed). Also handle "08:00-10:00".
    const cleaned = examTime.trim();
    const [rawStart, rawEnd] = cleaned.split("-").map((s) => s.trim());
    if (!rawStart || !rawEnd) throw new Error(`Unrecognized examTime format: ${examTime}`);

    const parseOne = (t: string): { h: number; m: number } => {
        if (t.includes(":")) {
            const [hh, mm] = t.split(":");
            return { h: Number(hh), m: Number(mm) };
        }
        // Treat as HHMM or HMM
        const digits = t.replace(/[^0-9]/g, "");
        if (digits.length < 3 || digits.length > 4) throw new Error(`Unrecognized time token: ${t}`);
        const h = digits.length === 3 ? Number(digits.slice(0, 1)) : Number(digits.slice(0, 2));
        const m = Number(digits.slice(-2));
        return { h, m };
    };

    const s = parseOne(rawStart);
    const e = parseOne(rawEnd);
    return { startHour: s.h, startMin: s.m, endHour: e.h, endMin: e.m };
}

function formatLocalDateTime(
    y: number,
    mo: number,
    d: number,
    h: number,
    mi: number
): string {
    // Local time (floating) or TZID time: YYYYMMDDTHHMMSS
    return `${y}${pad2(mo)}${pad2(d)}T${pad2(h)}${pad2(mi)}00`;
}

function safeUid(input: string): string {
    return input
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function generateIcsForSessions(
    ownerName: string,
    sessions: TestSession[],
    options: CalendarExportOptions
): string {
    const tz = options.timezone ?? "Asia/Shanghai";
    const uidNs = options.uidNamespace ?? "examschedule";

    const lines: string[] = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:-//examschedule//ics export//EN");
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");
    lines.push(`X-WR-CALNAME:${icsEscapeText(options.calendarName)}`);
    lines.push(`X-WR-TIMEZONE:${icsEscapeText(tz)}`);

    const now = new Date();
    const dtstamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(
        now.getUTCHours()
    )}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

    // Stable order is nice for predictable diffs
    const sorted = [...sessions].sort((a, b) => {
        const ak = `${a.examDate} ${a.examTime} ${a.subject}`;
        const bk = `${b.examDate} ${b.examTime} ${b.subject}`;
        return ak.localeCompare(bk, "zh");
    });

    for (const s of sorted) {
        const { year, month, day } = normalizeDate(s.examDate);
        const { startHour, startMin, endHour, endMin } = parseExamTime(s.examTime);

        const dtStart = formatLocalDateTime(year, month, day, startHour, startMin);
        const dtEnd = formatLocalDateTime(year, month, day, endHour, endMin);

        const summary = `${s.subject} (${s.grade}${s.classNum})`;
        const location = s.location;
        const proctors = [s.proctor1, s.proctor2].filter(Boolean).join(" / ");
        const descriptionParts: string[] = [];
        descriptionParts.push(`Owner: ${ownerName}`);
        descriptionParts.push(`Time: ${s.examDate} ${s.examTime}`);
        descriptionParts.push(`Duration: ${s.minutes} minutes`);
        descriptionParts.push(`Proctor(s): ${proctors}`);
        descriptionParts.push(`Students: ${s.numOfStudents}`);
        if (options.includeRoster) {
            descriptionParts.push(`Roster: ${s.students.join(", ")}`);
        }
        const description = descriptionParts.join("\n");

        const uid = `${safeUid(ownerName)}-${safeUid(s.examDate)}-${safeUid(s.examTime)}-${safeUid(
            s.subject
        )}@${safeUid(uidNs)}`;

        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${icsEscapeText(uid)}`);
        lines.push(`DTSTAMP:${dtstamp}`);
        lines.push(`DTSTART;TZID=${icsEscapeText(tz)}:${dtStart}`);
        lines.push(`DTEND;TZID=${icsEscapeText(tz)}:${dtEnd}`);
        lines.push(`SUMMARY:${icsEscapeText(summary)}`);
        lines.push(`LOCATION:${icsEscapeText(location)}`);
        lines.push(`DESCRIPTION:${icsEscapeText(description)}`);
        lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");

    return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}
