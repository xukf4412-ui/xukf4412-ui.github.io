(() => {
 'use strict';
 const rooms=window.TOUR_ROOMS,byId=Object.fromEntries(rooms.map(r=>[r.id,r]));
 const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let viewer,current='living',rotating=false,busy=false;
 const requested=location.hash.slice(1);if(byId[requested])current=requested;
 function go(id){if(!byId[id]||id===current||busy)return;rotating=false;$('rotate').setAttribute('aria-pressed','false');viewer?.stopAutoRotate();if(viewer){busy=true;viewer.loadScene(id,0,byId[id].yaw,100);}else{current=id;paint(id);$('fallback').src=byId[id].image;}}
 function paint(id){current=id;const r=byId[id];$('room-title').textContent=r.name;$('room-detail').textContent=r.detail;$('room-number').textContent=String(rooms.indexOf(r)+1).padStart(2,'0')+' / 06';document.title=r.name+' · 花园之家全景漫游';history.replaceState(null,'','#'+id);document.querySelectorAll('[data-room]').forEach(b=>{b.setAttribute('aria-current',String(b.dataset.room===id));});$('fallback').src=r.image;}
 function showLoading(id){$('status').hidden=false;$('status').textContent='正在进入'+byId[id].name+'…';$('panorama').setAttribute('aria-busy','true');$('error').hidden=true;}
 function hotspot(el,args){const button=document.createElement('button');button.className='hotspot-button';button.textContent=(args.to==='living'?'返回':'进入')+byId[args.to].name;button.setAttribute('aria-label',button.textContent+'全景');button.addEventListener('click',event=>{event.stopPropagation();go(args.to);});el.appendChild(button);}
 for(const [i,r] of rooms.entries()){
  const card=document.createElement('button');card.className='room-card';card.dataset.room=r.id;card.setAttribute('aria-label','切换到'+r.name+'全景');
  const image=document.createElement('img');image.src=r.image;image.alt='';image.loading='lazy';card.appendChild(image);
  const index=document.createElement('span');index.className='room-index';index.textContent=String(i+1).padStart(2,'0');card.appendChild(index);
  const name=document.createElement('span');name.textContent=r.name;card.appendChild(name);card.onclick=()=>go(r.id);$('rooms').appendChild(card);
  const point=document.createElement('button');point.className='plan-point';point.dataset.room=r.id;point.style.left=r.map[0]+'%';point.style.top=r.map[1]+'%';point.textContent=r.name;point.onclick=()=>{go(r.id);$('plan-dialog').close();};$('plan-points').appendChild(point);
 }
 const scenes=Object.fromEntries(rooms.map(r=>[r.id,{type:'equirectangular',panorama:r.image,hfov:100,yaw:r.yaw,pitch:0,hotSpots:r.links.map(link=>({id:r.id+'-'+link.to,pitch:link.pitch,yaw:link.yaw,cssClass:'tour-hotspot',createTooltipFunc:hotspot,createTooltipArgs:link}))}]));
 paint(current);showLoading(current);
 try {
  viewer=pannellum.viewer('panorama',{'default':{firstScene:current,autoLoad:true,showControls:false,showFullscreenCtrl:false,sceneFadeDuration:reduced?0:400,hfov:100,minHfov:50,maxHfov:120,minPitch:-65,maxPitch:65,mouseZoom:true,keyboardZoom:true,draggable:true,friction:.18},scenes});
  viewer.on('scenechange',id=>{paint(id);showLoading(id);});
  viewer.on('load',()=>{busy=false;$('status').hidden=true;$('panorama').setAttribute('aria-busy','false');$('fallback').hidden=true;});
  viewer.on('error',()=>{busy=false;$('status').hidden=true;$('panorama').setAttribute('aria-busy','false');$('error').hidden=false;$('error').textContent='全景加载失败，请切换房间重试。也可用下方房间列表浏览。';});
 }catch(error){viewer=null;busy=false;$('status').hidden=true;$('fallback').hidden=false;$('error').hidden=false;$('error').textContent='当前浏览器未能启动全景视图。您仍可切换房间查看效果图，建议使用新版 Chrome 或 Edge。';}
 $('home').onclick=()=>go('living');
 $('zoom-in').onclick=()=>viewer?.setHfov(Math.max(50,viewer.getHfov()-10),reduced?0:180);
 $('zoom-out').onclick=()=>viewer?.setHfov(Math.min(120,viewer.getHfov()+10),reduced?0:180);
 $('rotate').onclick=()=>{if(!viewer)return;rotating=!rotating;rotating?viewer.startAutoRotate(2):viewer.stopAutoRotate();$('rotate').setAttribute('aria-pressed',String(rotating));};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('tour').requestFullscreen();}catch{ $('status').textContent='浏览器暂不支持全屏';$('status').hidden=false;setTimeout(()=>$('status').hidden=true,2500);}};
 document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'退出全屏':'进入全屏');viewer?.resize();});
 $('open-plan').onclick=()=>$('plan-dialog').showModal();$('close-plan').onclick=()=>$('plan-dialog').close();
 $('plan-dialog').addEventListener('close',()=>$('open-plan').focus());
 $('plan-dialog').addEventListener('click',event=>{if(event.target===$('plan-dialog')){const b=event.target.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)event.target.close();}});
 window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(byId[id])go(id);});
})();
