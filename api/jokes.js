export default async function handler(req, res) {
  const params = new URL(req.url, 'https://example.org').searchParams;
  const requested = params.get('type') || 'Any';
  const allowed = ['Any', 'Programming', 'Misc', 'Pun', 'Spooky', 'Christmas'];
  const category = allowed.includes(requested) ? requested : 'Any';
  const options = new URLSearchParams({ amount: '6' });
  options.set('blacklistFlags', 'nsfw,religious,political,racist,sexist,explicit');
  if (params.get('search')) options.set('contains', params.get('search'));
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/' + category + '?' + options, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Upstream HTTP ' + response.status);
    const data = await response.json();
    if (data.error) return res.status(200).json({ jokes: [] });
    const all = Array.isArray(data.jokes) ? data.jokes : data.type ? [data] : [];
    const clean = all.filter(j => j.safe === true && !Object.values(j.flags || {}).some(Boolean));
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    return res.status(200).json({ jokes: clean });
  } catch (error) {
    console.error('JokeAPI request failed:', error.message);
    return res.status(502).json({ error: 'Jokes are temporarily unavailable. Please try again.' });
  }
}
