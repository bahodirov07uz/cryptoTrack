import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchMarketStats } from '../../client/src/lib/coingecko';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = await fetchMarketStats();
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return res.status(500).json({ error: 'Failed to fetch market statistics' });
  }
}