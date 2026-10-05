import {readFile,readdir,writeFile} from 'node:fs/promises';
// A dependency-free stored ZIP. Course files are small; no compression is needed.
const table=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc=(b:Buffer)=>{let c=0xffffffff;for(const x of b)c=table[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const files:string[]=[];
async function walk(dir:string){for(const f of await readdir(new URL('../'+dir+'/',import.meta.url),{withFileTypes:true})){const path=dir+'/'+f.name;if(/(?:^|\/)(?:dist|artifacts|node_modules|qa)(?:\/|$)|\.a$|atelier-course\.zip$|\.fasl$/.test(path))continue;if(f.isDirectory())await walk(path);else files.push(path);}}
for(const dir of ['game','workshop','src','scripts','public','.github'])await walk(dir);
files.push('LICENSE','package.json');
const local:Buffer[]=[],central:Buffer[]=[];let offset=0;
for(const f of files.sort()){
  const name=Buffer.from('slipstream-lisp-textbook/'+f),data=await readFile(new URL('../'+f,import.meta.url)),sum=crc(data);
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(33,12);header.writeUInt32LE(sum,14);header.writeUInt32LE(data.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(name.length,26);
  const entry=Buffer.alloc(46);entry.writeUInt32LE(0x02014b50);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(33,14);entry.writeUInt32LE(sum,16);entry.writeUInt32LE(data.length,20);entry.writeUInt32LE(data.length,24);entry.writeUInt16LE(name.length,28);entry.writeUInt32LE(offset,42);
  local.push(header,name,data);central.push(entry,name);offset+=header.length+name.length+data.length;
}
const length=central.reduce((n,x)=>n+x.length,0),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(length,12);end.writeUInt32LE(offset,16);
await writeFile(new URL('../public/assets/atelier-course.zip',import.meta.url),Buffer.concat([...local,...central,end]));
console.log(`Course ZIP: ${files.length} files.`);
