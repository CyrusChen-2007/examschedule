import { writable } from 'svelte/store';

export type Language = 'en' | 'zh';

export const language = writable<Language>('en');

type Translations = {
  [K in Language]: {
    title: string;
    search_placeholder: string;
    search_button: string;
    location: string;
    proctors: string;
    language_switch: string;
    semester: string;
    back: string;
    loading: string;
    no_results: string;
  }
};

export const translations: Translations = {
  en: {
    title: 'BRS Exam Schedule',
    search_placeholder: 'Your Name...',
    search_button: 'Search',
    location: 'Location',
    proctors: 'Proctors',
    language_switch: '中文',
    semester: '2024-2025 1st Semester Final Exam Schedule',
    back: 'Back',
    loading: 'Loading...',
    no_results: 'No exams found',
  },
  zh: {
    title: 'BRS 考试时间表',
    search_placeholder: '输入姓名...',
    search_button: '查找',
    location: '地点',
    proctors: '监考老师',
    language_switch: 'English',
    semester: '2024-2025 第一学期期末考试时间表',
    back: '返回',
    loading: '加载中...',
    no_results: '未找到考试',
  }
}; 