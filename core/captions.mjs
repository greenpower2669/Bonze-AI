/** Select captions from the canonical ordered ledger. */
export function captionPair(rows=[]){
 const valid=rows.filter(r=>typeof r?.text==='string'&&['human','bot'].includes(r.role));
 const humanIndex=valid.findLastIndex(r=>r.role==='human');
 const human=valid[humanIndex],bot=valid.slice(humanIndex+1).filter(r=>r.role==='bot').at(-1);
 return {heard:human?.text||'',answer:bot?.text||'',pending:valid.at(-1)?.role==='human'};
}
