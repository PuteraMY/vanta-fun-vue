const curated = [
  { activity: 'Go for a scenic walk and photograph five interesting things', type: 'recreational', participants: 1 },
  { activity: 'Try a new sport at a nearby park', type: 'recreational', participants: 2 },
  { activity: 'Organise a board game night', type: 'social', participants: 3 },
  { activity: 'Call a friend and plan a catch-up', type: 'social', participants: 2 },
  { activity: 'Learn five words in a new language', type: 'education', participants: 1 },
  { activity: 'Watch a short documentary and write down three facts', type: 'education', participants: 1 },
  { activity: 'Make a DIY photo frame from recycled materials', type: 'diy', participants: 1 },
  { activity: 'Create handmade bookmarks', type: 'diy', participants: 1 },
  { activity: 'Help clean up a shared outdoor space', type: 'charity', participants: 2 },
  { activity: 'Donate clothes you no longer wear', type: 'charity', participants: 1 },
  { activity: 'Cook a new pasta recipe', type: 'cooking', participants: 1 },
  { activity: 'Prepare a homemade snack for a friend', type: 'cooking', participants: 2 },
  { activity: 'Try ten minutes of mindful breathing', type: 'relaxation', participants: 1 },
  { activity: 'Read a chapter of a book somewhere peaceful', type: 'relaxation', participants: 1 },
  { activity: 'Make a playlist for your next road trip', type: 'music', participants: 1 },
  { activity: 'Learn a new chord on an instrument', type: 'music', participants: 1 },
  { activity: 'Organise your digital photo collection', type: 'busywork', participants: 1 },
  { activity: 'Declutter your workspace', type: 'busywork', participants: 1 }
];
export default async function handler(req, res) {
  const params = new URL(req.url, 'https://example.org').searchParams;
  const type = (params.get('type') || 'all').toLowerCase();
  const search = (params.get('search') || '').trim().toLowerCase();
  let results = [];
  if (type !== 'diy' && type !== 'music') {
    try {
      const url = 'https://bored-api.appbrewery.com/random?count=25';
      const response = await fetch(url, { signal: AbortSignal.timeout(9000) });
      if (!response.ok) throw new Error('Upstream HTTP ' + response.status);
      const data = await response.json();
      const remote = Array.isArray(data) ? data : Array.isArray(data.activities) ? data.activities : data.activity ? [data] : [];
      results = remote.filter(a => a && typeof a.activity === 'string');
    } catch (error) {
      console.warn('Bored API unavailable; showing curated suggestions:', error.message);
    }
  }
  const matches = a => (type === 'all' || String(a.type || '').toLowerCase() === type) && (!search || a.activity.toLowerCase().includes(search));
  let items = results.filter(matches);
  if (!items.length) items = curated.filter(matches);
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  return res.status(200).json({ activities: items.slice(0, 12), source: results.filter(matches).length ? 'Bored API' : 'curated suggestions' });
}
