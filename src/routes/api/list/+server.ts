import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNames } from '$lib/utils/csvParser';

export const GET: RequestHandler = async ({ url }) => {
  const type = url.searchParams.get('type');
  
  try {
    if (type !== 'student' && type !== 'proctor') {
      return new Response('Invalid type', { status: 400 });
    }

    const names = getNames(type);
    return new Response(names.join('\n'), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error reading names:', error);
    return new Response('Failed to load data', { status: 500 });
  }
}; 