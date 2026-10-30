/** Discovery only. Android credentials still authorize every protected action. */
export function createAdminGesture(){let count=0,last='',at=0;return{tap(side,now){if(!['left','right'].includes(side)){count=0;last='';return false;}if(now-at>8000||side===last){count=0;last='';}count++;last=side;at=now;if(count===60){count=0;last='';return true;}return false;}};}
