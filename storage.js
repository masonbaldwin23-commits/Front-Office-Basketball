export const SAVE_CODEC_PREFIX="FOB-LZW1:";

function bytesToBinary(bytes){
  let output="",chunk=8192;
  for(let index=0;index<bytes.length;index+=chunk)output+=String.fromCharCode(...bytes.subarray(index,index+chunk));
  return output;
}

function codesToString(codes){
  let output="",chunk=8192;
  for(let index=0;index<codes.length;index+=chunk)output+=String.fromCharCode(...codes.slice(index,index+chunk));
  return output;
}

function binaryToBytes(binary){
  const bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  return bytes;
}

export function compressText(text){
  if(!text)return "";
  const input=bytesToBinary(new TextEncoder().encode(text)),dictionary=new Map(),codes=[];
  let nextCode=256,phrase=input[0];
  for(let index=1;index<input.length;index++){
    const current=input[index],combined=phrase+current;
    if(dictionary.has(combined)){phrase=combined;continue;}
    codes.push(phrase.length===1?phrase.charCodeAt(0):dictionary.get(phrase));
    if(nextCode<65535)dictionary.set(combined,nextCode++);
    else{codes.push(65535);dictionary.clear();nextCode=256;}
    phrase=current;
  }
  codes.push(phrase.length===1?phrase.charCodeAt(0):dictionary.get(phrase));
  return codesToString(codes);
}

export function decompressText(compressed){
  if(!compressed)return "";
  const dictionary=new Map(),parts=[];
  let nextCode=256,index=0,previous="";
  while(index<compressed.length){
    const code=compressed.charCodeAt(index++);
    if(code===65535){dictionary.clear();nextCode=256;previous="";continue;}
    let entry;
    if(code<256)entry=String.fromCharCode(code);
    else if(dictionary.has(code))entry=dictionary.get(code);
    else if(code===nextCode&&previous)entry=previous+previous[0];
    else throw new Error("Invalid compressed save data");
    parts.push(entry);
    if(previous&&nextCode<65535)dictionary.set(nextCode++,previous+entry[0]);
    previous=entry;
  }
  return new TextDecoder().decode(binaryToBytes(parts.join("")));
}

export function encodeSaveData(value){return SAVE_CODEC_PREFIX+compressText(JSON.stringify(value));}

export function decodeSaveData(stored){
  if(!stored)return [];
  return JSON.parse(stored.startsWith(SAVE_CODEC_PREFIX)?decompressText(stored.slice(SAVE_CODEC_PREFIX.length)):stored);
}
