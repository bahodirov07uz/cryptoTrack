import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchCryptoById } from '../../client/src/lib/coingecko';

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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Crypto ID is required' });
  }

  try {
    const crypto = await fetchCryptoById(id);
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(crypto);
  } catch (error) {
    console.error(`Error fetching crypto ${id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
  }
}