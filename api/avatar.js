export default async function handler(req,res){
 const params=new URL(req.url,'https://example.org').searchParams
 const id=Number(params.get('id'))
 if(!Number.isSafeInteger(id)||id<1||id>100000)return res.status(400).json({error:'Invalid avatar ID'})
 try{
  const upstream=await fetch('https://rickandmortyapi.com/api/character/avatar/'+id+'.jpeg',{signal:AbortSignal.timeout(10000)})
  if(!upstream.ok)return res.status(404).json({error:'Avatar not found'})
  const type=upstream.headers.get('content-type')||''
  if(!type.startsWith('image/'))throw new Error('Unexpected content type')
  const bytes=Buffer.from(await upstream.arrayBuffer())
  if(bytes.length>2_000_000)throw new Error('Image exceeds size limit')
  res.setHeader('Content-Type','image/jpeg')
  res.setHeader('Cache-Control','public, s-maxage=86400, stale-while-revalidate=604800')
  res.setHeader('X-Content-Type-Options','nosniff')
  return res.status(200).send(bytes)
 }catch(e){
  console.warn('Avatar proxy failed:',e.message)
  return res.status(502).json({error:'Avatar temporarily unavailable'})
 }
}
