import test from 'node:test'
import assert from 'node:assert/strict'
import characters from '../api/characters.js'
import jokes from '../api/jokes.js'
import activities from '../api/activities.js'

function response(){
 const out={statusCode:200,headers:{}}
 out.status=function(n){this.statusCode=n;return this}
 out.json=function(data){this.body=data;return this}
 out.setHeader=function(k,v){this.headers[k]=v}
 return out
}
async function invoke(fn,path,mock){
 const original=globalThis.fetch
 globalThis.fetch=mock
 try{const res=response();await fn({url:path},res);return res}finally{globalThis.fetch=original}
}
test('characters: live-shaped API response is mapped to results',async()=>{
 const r=await invoke(characters,'/api/characters?status=alive&page=2',async url=>{
 assert.match(url,/status=alive/);assert.match(url,/page=2/)
 return {ok:true,json:async()=>({info:{pages:5},results:[{id:1,name:'Rick',status:'Alive'}]})}
 })
 assert.equal(r.statusCode,200);assert.equal(r.body.results[0].name,'Rick')
})
test('characters: no matching results produce an empty list',async()=>{
 const r=await invoke(characters,'/api/characters?search=nonexistent',async()=>({ok:false,status:404,json:async()=>({error:'Not found'})}))
 assert.deepEqual(r.body.results,[])
})
test('jokes: category filter, search and two-part joke',async()=>{
 const r=await invoke(jokes,'/api/jokes?type=Programming&search=code',async url=>{
 assert.match(url,/Programming/);assert.match(url,/contains=code/)
 return {ok:true,json:async()=>({jokes:[{id:2,category:'Programming',type:'twopart',setup:'Why?',delivery:'Because.',safe:true,flags:{}}]})}
 })
 assert.equal(r.body.jokes[0].delivery,'Because.')
})
test('jokes: upstream API failure returns friendly JSON error',async()=>{
 const r=await invoke(jokes,'/api/jokes',async()=>{throw Error('network')})
 assert.equal(r.statusCode,502);assert.match(r.body.error,/temporarily unavailable/)
})
test('activities: selected category always has a matching suggestion',async()=>{
 const r=await invoke(activities,'/api/activities?type=recreational',async()=>({ok:true,json:async()=>[]}))
 assert.ok(r.body.activities.length>0);assert.ok(r.body.activities.every(x=>x.type==='recreational'))
})
test('activities: searches are filtered case-insensitively',async()=>{
 const r=await invoke(activities,'/api/activities?type=music&search=PLAYLIST',async()=>{throw Error('should not fetch')})
 assert.ok(r.body.activities.length>0);assert.ok(r.body.activities.every(x=>x.activity.toLowerCase().includes('playlist')))
})
test('activities: no matching search yields an empty result',async()=>{
 const r=await invoke(activities,'/api/activities?type=music&search=zzzznotfound',async()=>{throw Error('should not fetch')})
 assert.deepEqual(r.body.activities,[])
})
test('activities: upstream outage falls back to curated suggestions',async()=>{
 const r=await invoke(activities,'/api/activities?type=social',async()=>{throw Error('offline')})
 assert.equal(r.statusCode,200);assert.equal(r.body.source,'curated suggestions');assert.ok(r.body.activities.length>0)
})

test('jokes: flagged content is excluded',async()=>{
 const r=await invoke(jokes,'/api/jokes',async()=>({ok:true,json:async()=>({jokes:[{id:1,safe:false,flags:{nsfw:true}},{id:2,safe:true,flags:{nsfw:false}}]})}))
 assert.deepEqual(r.body.jokes.map(j=>j.id),[2])
})
