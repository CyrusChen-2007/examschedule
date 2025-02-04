import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionsByName } from '$lib/utils/csvParser';

export const GET: RequestHandler = async ({ url }) => {
  const type = url.searchParams.get('type');
  const name = url.searchParams.get('name');
  
  try {
    if (!name || (type !== 'student' && type !== 'proctor')) {
      return new Response('Invalid parameters', { status: 400 });
    }

    const sessions = getSessionsByName(name, type);
    return json({ [name]: sessions });
  } catch (error) {
    console.error('Error reading sessions:', error);
    return new Response('Failed to load data', { status: 500 });
  }
}; 