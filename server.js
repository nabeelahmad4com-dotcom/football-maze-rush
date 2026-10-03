
const express=require('express'),http=require('http'),{Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);
app.use(express.static('public'));
const rooms=new Map();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function maze(level,difficulty='medium'){
 const base={easy:19,medium:24,hard:29,extreme:34}[difficulty]||24;const cells=Math.min(34,base+Math.max(0,level-1));
 // Keep the selected board size identical for both players and every round.
 const n=cells,w=n*2+1,h=n*2+1;
 const g=Array.from({length:h},()=>Array(w).fill(1));
 const stack=[[1,1]];g[1][1]=0;
 while(stack.length){let [x,y]=stack[stack.length-1],opts=[];
  for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){let nx=x+dx,ny=y+dy;if(nx>0&&ny>0&&nx<w-1&&ny<h-1&&g[ny][nx])opts.push([nx,ny,dx,dy]);}
  if(!opts.length){stack.pop();continue;}
  let [nx,ny,dx,dy]=opts[Math.floor(Math.random()*opts.length)];g[y+dy/2][x+dx/2]=0;g[ny][nx]=0;stack.push([nx,ny]);
 }
 // Ensure finish cell is reachable (maze generation carves all odd cells).
 return {grid:g,width:w,height:h,start:{x:1,y:1},goal:{x:w-2,y:h-2}};
}
function pub(r){return {code:r.code,status:r.status,players:r.players.map(p=>p?{id:p.id,name:p.name,x:p.x,y:p.y,dir:p.dir,score:p.score,ready:p.ready}:null),maze:r.maze,level:r.level,remaining:r.remaining,duration:r.duration,difficulty:r.difficulty,winner:r.winner};}
function broadcast(r){io.to(r.code).emit('state',pub(r));}
function fresh(code,settings={}){const duration=clamp(Number(settings.duration)||180,60,600),difficulty=['easy','medium','hard','extreme'].includes(settings.difficulty)?settings.difficulty:'medium';return {code,status:'waiting',players:[null,null],maze:maze(1,difficulty),level:1,remaining:duration,duration,difficulty,winner:null,lastTick:Date.now(),timer:null,scoredThisRound:false,lastMoves:[0,0]};}
function start(r){if(r.players.every(Boolean)){r.status='playing';r.remaining=r.duration;r.lastTick=Date.now();r.players.forEach(p=>{p.x=r.maze.start.x;p.y=r.maze.start.y;p.dir='right';});}}
function score(r,i){if(r.status!=='playing'||r.scoredThisRound)return;r.scoredThisRound=true;r.players[i].score++;r.level=Math.floor((r.players[0].score+r.players[1].score)/2)+1;r.maze=maze(r.level,r.difficulty);r.players.forEach(p=>{p.x=r.maze.start.x;p.y=r.maze.start.y;p.dir='right';});io.to(r.code).emit('goal',{player:i,level:r.level});setTimeout(()=>{r.scoredThisRound=false;},350);}
io.on('connection',s=>{
 s.on('create',({name,duration,difficulty}={})=>{let code;do{code=Math.random().toString(36).slice(2,6).toUpperCase()}while(rooms.has(code));let r=fresh(code,{duration,difficulty});rooms.set(code,r);join(s,r,name);});
 s.on('join',({code,name})=>{let r=rooms.get(String(code||'').toUpperCase());if(!r)return s.emit('errorMsg','Room not found. Check the code.');if(r.players.every(Boolean))return s.emit('errorMsg','Room is full.');join(s,r,name);});
 function join(sock,r,name){let i=r.players.findIndex(p=>!p);r.players[i]={id:sock.id,name:String(name||`Player ${i+1}`).slice(0,18),x:1,y:1,dir:'right',score:0,ready:true};sock.join(r.code);sock.data.room=r.code;sock.data.index=i;if(r.players.every(Boolean))start(r);broadcast(r);}
 s.on('move',dir=>{let r=rooms.get(s.data.room),i=s.data.index;if(!r||r.status!=='playing'||!r.players[i]||Date.now()-r.lastMoves[i]<65)return;r.lastMoves[i]=Date.now();const p=r.players[i],d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return;p.dir=dir;let nx=p.x+d[0],ny=p.y+d[1];if(nx<0||ny<0||ny>=r.maze.height||nx>=r.maze.width||r.maze.grid[ny][nx])return;p.x=nx;p.y=ny;if(nx===r.maze.goal.x&&ny===r.maze.goal.y){score(r,i);}broadcast(r);});
 s.on('disconnect',()=>{let r=rooms.get(s.data.room);if(!r)return;let i=r.players.findIndex(p=>p&&p.id===s.id);if(i>=0){r.players[i]=null;r.status='waiting';r.winner=null;if(!r.players.some(Boolean)){clearInterval(r.timer);rooms.delete(r.code);}broadcast(r);}});
});
setInterval(()=>{for(const r of rooms.values())if(r.status==='playing'){r.remaining=Math.max(0,r.remaining-(Date.now()-r.lastTick)/1000);r.lastTick=Date.now();if(r.remaining<=0){r.status='finished';r.winner=!r.players[0]||!r.players[1]?'Draw':r.players[0].score===r.players[1].score?'Draw':r.players[0].score>r.players[1].score?0:1;}broadcast(r);}},250);
const PORT=process.env.PORT||3000;server.listen(PORT,'0.0.0.0',()=>console.log(`Football Maze Rush running at http://localhost:${PORT}`));
