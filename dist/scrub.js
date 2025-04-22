var Ct=Object.defineProperty;var It=Object.getOwnPropertyDescriptor;var At=Object.getOwnPropertyNames;var Lt=Object.prototype.hasOwnProperty;var Pt=(c,t)=>{for(var e in t)Ct(c,e,{get:t[e],enumerable:!0})},Ft=(c,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of At(t))!Lt.call(c,s)&&s!==e&&Ct(c,s,{get:()=>t[s],enumerable:!(i=It(t,s))||i.enumerable});return c};var Ut=c=>Ft(Ct({},"__esModule",{value:!0}),c);var Yt={};Pt(Yt,{BVH:()=>nt,BVHBranch:()=>Z,Camera:()=>ut,CameraChanges:()=>dt,CircleCollider:()=>F,Collider:()=>K,CollisionResult:()=>T,CollisionSystem:()=>ot,Costume:()=>z,ErrorMessages:()=>y,EventEmitter:()=>U,Game:()=>R,JetcodeSocket:()=>g,JetcodeSocketConnection:()=>st,Keyboard:()=>at,KeyboardMap:()=>I,Mouse:()=>lt,MultiplayerControl:()=>mt,MultiplayerGame:()=>kt,MultiplayerSprite:()=>pt,OrphanSharedData:()=>X,Player:()=>_t,PointCollider:()=>N,PolygonCollider:()=>w,Registry:()=>O,SAT:()=>rt,ScheduledCallbackExecutor:()=>V,ScheduledCallbackItem:()=>Y,ScheduledState:()=>H,SharedData:()=>Tt,Sprite:()=>$,Stage:()=>Ot,Styles:()=>ht,ValidatorFactory:()=>ct,aabbAABB:()=>Mt,circleCircle:()=>Nt,polygonCircle:()=>xt,polygonPolygon:()=>Dt,separatingAxis:()=>wt});module.exports=Ut(Yt);var st=class{constructor(t,e,i=0){this.connectActions=[g.JOINED,g.RECEIVE_DATA,g.MEMBER_JOINED,g.MEMBER_LEFT,g.GAME_STARTED,g.GAME_STOPPED,g.ERROR];this.socket=t,this.lobbyId=i,this.memberId=null,this.connects={},this._listenSocket()}_listenSocket(){this.socket.onmessage=t=>{let[e,i,s]=this._parse(t.data);e===g.RECEIVE_DATA?this.emit(g.RECEIVE_DATA,[s,i,i?.MemberId===this.memberId]):e===g.MEMBER_JOINED?this.emit(g.MEMBER_JOINED,[i,i?.MemberId===this.memberId]):e===g.MEMBER_LEFT?this.emit(g.MEMBER_LEFT,[i,i?.MemberId===this.memberId]):this.connects[e]&&this.emit(e,[i])}}emit(t,e){this.connects[t]&&this.connects[t].forEach(i=>{i(...e)})}connect(t,e){if(!this.connectActions.includes(t))throw new Error("This actions is not defined.");return this.connects[t]||(this.connects[t]=[]),this.connects[t].push(e),e}disconnect(t,e){if(!this.connectActions.includes(t))throw new Error("This action is not defined.");this.connects[t]&&(this.connects[t]=this.connects[t].filter(i=>i!==e))}sendData(t,e={}){if(!this.lobbyId)throw new Error("You are not in the lobby!");let i=`${g.SEND_DATA}
`;for(let[s,n]of Object.entries(e))i+=s+"="+n+`
`;i+=`SendTime=${Date.now()}
`,i+=`
`+t,this.socket.send(i)}joinLobby(t,e,i={}){return new Promise((s,n)=>{e||(e=0);let r=`${g.JOIN_LOBBY}
`;r+=`GameToken=${t}
`,r+=`LobbyId=${e}
`;for(let[o,a]of Object.entries(i))r+=`${o}=${a}
`;this.socket.send(r),this.connect(g.JOINED,o=>{if(o.LobbyId&&o.MemberId&&o.CurrentTime){this.lobbyId=o.LobbyId,this.memberId=o.MemberId;let a=Date.now();this.deltaTime=a-Number(o.CurrentTime),s(this.lobbyId)}else n(new Error("Couldn't join the lobby"))})})}leaveLobby(){if(!this.lobbyId)return;let t=`${g.LEAVE_LOBBY}
LobbyId=${this.lobbyId}
`;this.socket.send(t),this.lobbyId=null}_parse(t){let e=t.split(`
`),i=e[0],s="",n=[],r="parameters";for(let o=1;o<e.length;o++){let a=e[o];if(a===""&&r==="parameters")r="value";else if(r==="parameters"){let l=a.split("="),h=l[0];n[h]=l.length>1?l[1]:null}else r==="value"&&(s=s+a+`
`)}return s&&(s=s.slice(0,-1)),[i,n,s]}};var g=class{constructor(t="ws://localhost:17500"){this.socketUrl=t,this.socket=null,this.defaultParameters={LobbyAutoCreate:!0,MaxMembers:2,MinMembers:2,StartGameWithMembers:2}}connect(t,e=null,i={}){let s={...this.defaultParameters,...i};return new Promise((n,r)=>{this.socket=new WebSocket(this.socketUrl),this.socket.onopen=()=>{let o=new st(this.socket,t,e);o.joinLobby(t,e,s).then(()=>{n(o)}).catch(r)},this.socket.onerror=o=>{r(o)}})}};g.JOIN_LOBBY="JOIN_LOBBY",g.LEAVE_LOBBY="LEAVE_LOBBY",g.SEND_DATA="SEND_DATA",g.JOINED="JOINED",g.RECEIVE_DATA="RECEIVE_DATA",g.MEMBER_JOINED="MEMBER_JOINED",g.MEMBER_LEFT="MEMBER_LEFT",g.GAME_STARTED="GAME_STARTED",g.GAME_STOPPED="GAME_STOPPED",g.ERROR="ERROR";var Et=[],Z=class c{constructor(){this._bvh_parent=null;this._bvh_branch=!0;this._bvh_left=null;this._bvh_right=null;this._bvh_sort=0;this._bvh_min_x=0;this._bvh_min_y=0;this._bvh_max_x=0;this._bvh_max_y=0}static getBranch(){return Et.length?Et.pop():new c}static releaseBranch(t){Et.push(t)}static sortBranches(t,e){return t.sort>e.sort?-1:1}};var tt=class tt{constructor(){this._hierarchy=null;this._bodies=[];this._dirty_branches=[]}insert(t,e=!1){if(!e){let p=t._bvh;if(p&&p!==this)throw new Error("Body belongs to another collision system");t._bvh=this,this._bodies.push(t)}let i=t._polygon,s=t.x,n=t.y;i&&(t._dirty_coords||t.x!==t._x||t.y!==t._y||t.angle!==t._angle||t.scale_x!==t._scale_x||t.scale_y!==t._scale_y)&&t._calculateCoords();let r=t._bvh_padding,o=i?0:t.radius*t.scale,a=(i?t._min_x:s-o)-r,l=(i?t._min_y:n-o)-r,h=(i?t._max_x:s+o)+r,u=(i?t._max_y:n+o)+r;t._bvh_min_x=a,t._bvh_min_y=l,t._bvh_max_x=h,t._bvh_max_y=u;let d=this._hierarchy,_=0;if(!d)this._hierarchy=t;else{let p=0;for(;p++<tt.MAX_DEPTH;)if(d._bvh_branch){let m=d._bvh_left,f=m._bvh_min_y,b=m._bvh_max_x,v=m._bvh_max_y,C=a<m._bvh_min_x?a:m._bvh_min_x,S=l<f?l:f,x=h>b?h:b,A=u>v?u:v,B=(b-m._bvh_min_x)*(v-f),et=(x-C)*(A-S)-B,L=d._bvh_right,P=L._bvh_min_x,j=L._bvh_min_y,W=L._bvh_max_x,M=L._bvh_max_y,D=a<P?a:P,k=l<j?l:j,G=h>W?h:W,Q=u>M?u:M,it=(W-P)*(M-j),gt=(G-D)*(Q-k)-it;d._bvh_sort=_++,d._bvh_min_x=C<D?C:D,d._bvh_min_y=S<k?S:k,d._bvh_max_x=x>G?x:G,d._bvh_max_y=A>Q?A:Q,d=et<=gt?m:L}else{let m=d._bvh_parent,f=d._bvh_min_x,b=d._bvh_min_y,v=d._bvh_max_x,C=d._bvh_max_y,S=d._bvh_parent=t._bvh_parent=Z.getBranch();S._bvh_parent=m,S._bvh_left=d,S._bvh_right=t,S._bvh_sort=_++,S._bvh_min_x=a<f?a:f,S._bvh_min_y=l<b?l:b,S._bvh_max_x=h>v?h:v,S._bvh_max_y=u>C?u:C,m?m._bvh_left===d?m._bvh_left=S:m._bvh_right=S:this._hierarchy=S;break}}}remove(t,e=!1){if(!e){let o=t._bvh;if(o&&o!==this)throw new Error("Body belongs to another collision system");t._bvh=null,this._bodies.splice(this._bodies.indexOf(t),1)}if(this._hierarchy===t){this._hierarchy=null;return}let i=t._bvh_parent;if(!i){console.error("The parent is not defined in the collision system.");return}let s=i._bvh_parent,n=i._bvh_left,r=n===t?i._bvh_right:n;if(r._bvh_parent=s,r._bvh_branch&&(r._bvh_sort=i._bvh_sort),s){s._bvh_left===i?s._bvh_left=r:s._bvh_right=r;let o=s,a=0;for(;o&&a++<tt.MAX_DEPTH;){let l=o._bvh_left,h=l._bvh_min_x,u=l._bvh_min_y,d=l._bvh_max_x,_=l._bvh_max_y,p=o._bvh_right,m=p._bvh_min_x,f=p._bvh_min_y,b=p._bvh_max_x,v=p._bvh_max_y;o._bvh_min_x=h<m?h:m,o._bvh_min_y=u<f?u:f,o._bvh_max_x=d>b?d:b,o._bvh_max_y=_>v?_:v,o=o._bvh_parent}}else this._hierarchy=r;Z.releaseBranch(i)}update(){let t=this._bodies,e=t.length;for(let i=0;i<e;++i){let s=t[i],n=!1;if(!n&&s.padding!==s._bvh_padding&&(s._bvh_padding=s.padding,n=!0),!n){let r=s._polygon;r&&(s._dirty_coords||s.x!==s._x||s.y!==s._y||s.angle!==s._angle||s.scale_x!==s._scale_x||s.scale_y!==s._scale_y)&&s._calculateCoords();let o=s.x,a=s.y,l=r?0:s.radius*s.scale,h=r?s._min_x:o-l,u=r?s._min_y:a-l,d=r?s._max_x:o+l,_=r?s._max_y:a+l;n=h<s._bvh_min_x||u<s._bvh_min_y||d>s._bvh_max_x||_>s._bvh_max_y}n&&(this.remove(s,!0),this.insert(s,!0))}}potentials(t){let e=[],i=t._bvh_min_x,s=t._bvh_min_y,n=t._bvh_max_x,r=t._bvh_max_y,o=this._hierarchy,a=!0;if(!o||!o._bvh_branch)return e;let l=0;for(;o&&l++<tt.MAX_DEPTH;){if(a){a=!1;let d=o._bvh_branch?o._bvh_left:null;for(;d&&d._bvh_max_x>=i&&d._bvh_max_y>=s&&d._bvh_min_x<=n&&d._bvh_min_y<=r;)o=d,d=o._bvh_branch?o._bvh_left:null}let h=o._bvh_branch,u=h?o._bvh_right:null;if(u&&u._bvh_max_x>i&&u._bvh_max_y>s&&u._bvh_min_x<n&&u._bvh_min_y<r)o=u,a=!0;else{!h&&o!==t&&e.push(o);let d=o._bvh_parent;if(d){for(;d&&d._bvh_right===o;)o=d,d=o._bvh_parent;o=d}else break}}return e}draw(t){let e=this._bodies,i=e.length;for(let s=0;s<i;++s)e[s].draw(t)}drawBVH(t){let e=this._hierarchy,i=!0;for(;e;){if(i){i=!1;let h=e._bvh_branch?e._bvh_left:null;for(;h;)e=h,h=e._bvh_branch?e._bvh_left:null}let s=e._bvh_branch,n=e._bvh_min_x,r=e._bvh_min_y,o=e._bvh_max_x,a=e._bvh_max_y,l=s?e._bvh_right:null;if(t.moveTo(n,r),t.lineTo(o,r),t.lineTo(o,a),t.lineTo(n,a),t.lineTo(n,r),l)e=l,i=!0;else{let h=e._bvh_parent;if(h){for(;h&&h._bvh_right===e;)e=h,h=e._bvh_parent;e=h}else break}}}};tt.MAX_DEPTH=1e4;var nt=tt;function rt(c,t,e=null,i=!0){let s=c._polygon,n=t._polygon,r=!1;return e&&(e.a=c,e.b=t,e.a_in_b=!0,e.b_in_a=!0,e.overlap=null,e.overlap_x=0,e.overlap_y=0,e.collidedSprite=null),s&&(c._dirty_coords||c.x!==c._x||c.y!==c._y||c.angle!==c._angle||c.scale_x!==c._scale_x||c.scale_y!==c._scale_y)&&c._calculateCoords(),n&&(t._dirty_coords||t.x!==t._x||t.y!==t._y||t.angle!==t._angle||t.scale_x!==t._scale_x||t.scale_y!==t._scale_y)&&t._calculateCoords(),(!i||Mt(c,t))&&(s&&c._dirty_normals&&c._calculateNormals(),n&&t._dirty_normals&&t._calculateNormals(),r=s&&n?Dt(c,t,e):s?xt(c,t,e,!1):n?xt(t,c,e,!0):Nt(c,t,e)),e&&(e.collision=r),r}function Mt(c,t){let e=c._polygon,i=e?0:c.x,s=e?0:c.y,n=e?0:c.radius*c.scale,r=e?c._min_x:i-n,o=e?c._min_y:s-n,a=e?c._max_x:i+n,l=e?c._max_y:s+n,h=t._polygon,u=h?0:t.x,d=h?0:t.y,_=h?0:t.radius*t.scale,p=h?t._min_x:u-_,m=h?t._min_y:d-_,f=h?t._max_x:u+_,b=h?t._max_y:d+_;return r<f&&o<b&&a>p&&l>m}function Dt(c,t,e=null){let i=c._coords.length,s=t._coords.length;if(i===2&&s===2){let l=c._coords,h=t._coords;return e&&(e.overlap=0),l[0]===h[0]&&l[1]===h[1]}let n=c._coords,r=t._coords,o=c._normals,a=t._normals;if(i>2){for(let l=0,h=1;l<i;l+=2,h+=2)if(wt(n,r,o[l],o[h],e))return!1}if(s>2){for(let l=0,h=1;l<s;l+=2,h+=2)if(wt(n,r,a[l],a[h],e))return!1}return!0}function xt(c,t,e=null,i=!1){let s=c._coords,n=c._edges,r=c._normals,o=t.x,a=t.y,l=t.radius*t.scale,h=l*2,u=l*l,d=s.length,_=!0,p=!0,m=null,f=0,b=0;if(d===2){let v=o-s[0],C=a-s[1],S=v*v+C*C;if(S>u)return!1;if(e){let x=Math.sqrt(S);m=l-x,f=v/x,b=C/x,p=!1}}else for(let v=0,C=1;v<d;v+=2,C+=2){let S=o-s[v],x=a-s[C],A=n[v],B=n[C],q=S*A+x*B,et=q<0?-1:q>A*A+B*B?1:0,L=!1,P=0,j=0,W=0;if(e&&_&&S*S+x*x>u&&(_=!1),et){let M=et===-1,D=M?v===0?d-2:v-2:v===d-2?0:v+2,k=D+1,G=o-s[D],Q=a-s[k],it=n[D],ft=n[k],gt=G*it+Q*ft;if((gt<0?-1:gt>it*it+ft*ft?1:0)===-et){let yt=M?S:G,vt=M?x:Q,Rt=yt*yt+vt*vt;if(Rt>u)return!1;if(e){let St=Math.sqrt(Rt);L=!0,P=l-St,j=yt/St,W=vt/St,p=!1}}}else{let M=r[v],D=r[C],k=S*M+x*D,G=k<0?-k:k;if(k>0&&G>l)return!1;e&&(L=!0,P=l-k,j=M,W=D,(p&&k>=0||P<h)&&(p=!1))}L&&(m===null||m>P)&&(m=P,f=j,b=W)}return e&&(e.a_in_b=i?p:_,e.b_in_a=i?_:p,e.overlap=m,e.overlap_x=i?-f:f,e.overlap_y=i?-b:b),!0}function Nt(c,t,e=null){let i=c.radius*c.scale,s=t.radius*t.scale,n=t.x-c.x,r=t.y-c.y,o=i+s,a=n*n+r*r;if(a>o*o)return!1;if(e){let l=Math.sqrt(a);e.a_in_b=i<=s&&l<=s-i,e.b_in_a=s<=i&&l<=i-s,e.overlap=o-l,e.overlap_x=n/l,e.overlap_y=r/l}return!0}function wt(c,t,e,i,s=null){let n=c.length,r=t.length;if(!n||!r)return!0;let o=null,a=null,l=null,h=null;for(let u=0,d=1;u<n;u+=2,d+=2){let _=c[u]*e+c[d]*i;(o===null||o>_)&&(o=_),(a===null||a<_)&&(a=_)}for(let u=0,d=1;u<r;u+=2,d+=2){let _=t[u]*e+t[d]*i;(l===null||l>_)&&(l=_),(h===null||h<_)&&(h=_)}if(o>h||a<l)return!0;if(s){let u=0;if(o<l)if(s.a_in_b=!1,a<h)u=a-l,s.b_in_a=!1;else{let p=a-l,m=h-o;u=p<m?p:-m}else if(s.b_in_a=!1,a>h)u=o-h,s.a_in_b=!1;else{let p=a-l,m=h-o;u=p<m?p:-m}let d=s.overlap,_=u<0?-u:u;if(d===null||d>_){let p=u<0?-1:1;s.overlap=_,s.overlap_x=e*p,s.overlap_y=i*p}}return!1}var T=class{constructor(){this.collision=!1;this.a=null;this.b=null;this.a_in_b=!1;this.b_in_a=!1;this.overlap=0;this.overlap_x=0;this.overlap_y=0}};var K=class{constructor(t=0,e=0,i=5){this._offset_x=0;this._offset_y=0;this._circle=!1;this._polygon=!1;this._point=!1;this._bvh=null;this._bvh_parent=null;this._bvh_branch=!1;this._bvh_min_x=0;this._bvh_min_y=0;this._bvh_max_x=0;this._bvh_max_y=0;this._parent_sprite=null;this._center_distance=0;this._center_angle=0;this.x=t,this.y=e,this.padding=i,this._bvh_padding=i}collides(t,e=null,i=!0){return rt(this,t,e,i)}potentials(){let t=this._bvh;if(t===null)throw new Error("Body does not belong to a collision system");return t.potentials(this)}remove(){let t=this._bvh;t&&t.remove(this,!1)}set parentSprite(t){this._parent_sprite=t}get parentSprite(){return this._parent_sprite}set offset_x(t){this._offset_x=-t,this.updateCenterParams()}get offset_x(){return-this._offset_x}set offset_y(t){this._offset_y=-t,this.updateCenterParams()}get offset_y(){return-this._offset_y}get center_offset_x(){if(this._parent_sprite.rotateStyle==="leftRight"||this._parent_sprite.rotateStyle==="none"){let t=this._parent_sprite._direction>180&&this._parent_sprite.rotateStyle==="leftRight"?-1:1;return this._offset_x*t}return this._center_distance*Math.cos(this._center_angle-this._parent_sprite.globalAngleRadians)}get center_offset_y(){return this._parent_sprite.rotateStyle==="leftRight"||this._parent_sprite.rotateStyle==="none"?-this._offset_y:-this._center_distance*Math.sin(this._center_angle-this._parent_sprite.globalAngleRadians)}createResult(){return new T}updateCenterParams(){this._center_distance=Math.hypot(this._offset_x,this._offset_y),this._center_angle=-Math.atan2(-this._offset_y,-this._offset_x)}static createResult(){return new T}};var F=class extends K{constructor(t=0,e=0,i=0,s=1,n=5){super(t,e,n),this.radius=i,this.scale=s}draw(t){let e=this.x,i=this.y,s=this.radius*this.scale;t.moveTo(e+s,i),t.arc(e,i,s,0,Math.PI*2)}};var w=class c extends K{constructor(e=0,i=0,s=[],n=0,r=1,o=1,a=5){super(e,i,a);this._min_x=0;this._min_y=0;this._max_x=0;this._max_y=0;this._points=null;this._coords=null;this._edges=null;this._normals=null;this._dirty_coords=!0;this._dirty_normals=!0;this._origin_points=null;this.angle=n,this.scale_x=r,this.scale_y=o,this._polygon=!0,this._x=e,this._y=i,this._angle=n,this._scale_x=r,this._scale_y=o,this._origin_points=s,c.prototype.setPoints.call(this,s)}draw(e){(this._dirty_coords||this.x!==this._x||this.y!==this._y||this.angle!==this._angle||this.scale_x!==this._scale_x||this.scale_y!==this._scale_y)&&this._calculateCoords();let i=this._coords;if(i.length===2)e.moveTo(i[0],i[1]),e.arc(i[0],i[1],1,0,Math.PI*2);else{e.moveTo(i[0],i[1]);for(let s=2;s<i.length;s+=2)e.lineTo(i[s],i[s+1]);i.length>4&&e.lineTo(i[0],i[1])}}setPoints(e){let i=e.length;this._points=new Float64Array(i*2),this._coords=new Float64Array(i*2),this._edges=new Float64Array(i*2),this._normals=new Float64Array(i*2);let s=this._points;for(let n=0,r=0,o=1;n<i;++n,r+=2,o+=2){let a=e[n];s[r]=a[0],s[o]=a[1]}this._dirty_coords=!0}_calculateCoords(){let e=this.x,i=this.y,s=this.angle,n=this.scale_x,r=this.scale_y,o=this._points,a=this._coords,l=o.length,h,u,d,_;for(let p=0,m=1;p<l;p+=2,m+=2){let f=o[p]*n,b=o[m]*r;if(s){let v=Math.cos(s),C=Math.sin(s),S=f,x=b;f=S*v-x*C,b=S*C+x*v}f+=e,b+=i,a[p]=f,a[m]=b,p===0?(h=u=f,d=_=b):(f<h?h=f:f>u&&(u=f),b<d?d=b:b>_&&(_=b))}this._x=e,this._y=i,this._angle=s,this._scale_x=n,this._scale_y=r,this._min_x=h,this._min_y=d,this._max_x=u,this._max_y=_,this._dirty_coords=!1,this._dirty_normals=!0}_calculateNormals(){let e=this._coords,i=this._edges,s=this._normals,n=e.length;for(let r=0,o=1;r<n;r+=2,o+=2){let a=r+2<n?r+2:0,l=e[a]-e[r],h=e[a+1]-e[o],u=l||h?Math.sqrt(l*l+h*h):0;i[r]=l,i[o]=h,s[r]=u?h/u:0,s[o]=u?-l/u:0}this._dirty_normals=!1}get points(){return this._origin_points}};var N=class extends w{constructor(t=0,e=0,i=5){super(t,e,[[0,0]],0,1,1,i),this._point=!0}};N.prototype.setPoints=void 0;var ot=class{constructor(){this._bvh=new nt}createCircle(t=0,e=0,i=0,s=1,n=0){let r=new F(t,e,i,s,n);return this._bvh.insert(r),r}createPolygon(t=0,e=0,i=[[0,0]],s=0,n=1,r=1,o=0){let a=new w(t,e,i,s,n,r,o);return this._bvh.insert(a),a}createPoint(t=0,e=0,i=0){let s=new N(t,e,i);return this._bvh.insert(s),s}createResult(){return new T}static createResult(){return new T}insert(...t){for(let e of t)this._bvh.insert(e,!1);return this}remove(...t){for(let e of t)this._bvh.remove(e,!1);return this}update(){return this._bvh.update(),this}draw(t){return this._bvh.draw(t)}drawBVH(t){return this._bvh.drawBVH(t)}potentials(t){return this._bvh.potentials(t)}collides(t,e,i=null,s=!0){return rt(t,e,i,s)}};var E=class E{static getMessage(t,e,i=null){if(!E.messages[t])throw new Error("Message is not defined.");if(!E.messages[t][e])throw new Error("Message for this locale is not defined.");let s=E.messages[t][e];return i&&(s=E.replaceVariables(s,i)),s}static replaceVariables(t,e){return t.replace(/\${([^}]+)}/g,(i,s)=>e[s]!==void 0?e[s]:"")}};E.SCRIPT_ERROR="script_error",E.MISTAKE_METHOD="mistake_method",E.MISTAKE_METHOD_WITH_CLOSEST="mistake_method_with_closest",E.NEED_STAGE_BEFORE_RUN_GAME="need_stage_before_run_game",E.NEED_CREATE_STAGE_BEFORE_SPRITE="need_create_stage_before_sprite",E.COSTUME_NOT_LOADED="costume_not_loaded",E.BACKGROUND_NOT_LOADED="background_not_loaded",E.CLONED_NOT_READY="cloned_not_ready",E.SOUND_INDEX_NOT_FOUND="sound_index_not_found",E.SOUND_NAME_NOT_FOUND="sound_name_not_found",E.SOUND_NAME_ALREADY_EXISTS="sound_name_already_exists",E.SOUND_NOT_ALLOWED_ERROR="sound_not_allowed_error",E.SOUND_USE_NOT_READY="sound_use_not_ready",E.COSTUME_INDEX_NOT_FOUND="costume_index_not_found",E.COSTUME_NAME_NOT_FOUND="costume_name_not_found",E.COSTUME_SWITCH_NOT_READY="costume_switch_not_ready",E.STAMP_NOT_READY="stamp_not_ready",E.STAMP_COSTUME_NOT_FOUND="stamp_costume_not_found",E.COLLIDER_NAME_NOT_FOUND="collider_name_not_found",E.messages={script_error:{ru:"\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430, \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u044C\u0442\u0435\u0441\u044C \u0441 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0435\u0439 \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u0438.",en:"An error has occurred, take a look at the details in the console."},mistake_method:{ru:'${className}: \u041C\u0435\u0442\u043E\u0434 \u0438\u043B\u0438 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E "${prop}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E',en:'${className}: Method "${prop}" not found'},mistake_method_with_closest:{ru:'${className}: \u041C\u0435\u0442\u043E\u0434 \u0438\u043B\u0438 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E "${prop}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0432\u044B \u0438\u043C\u0435\u043B\u0438 \u0432\u0432\u0438\u0434\u0443: ${closestString}?',en:'${className}: Method "${prop}" not found. Did you mean: ${closestString}?'},need_stage_before_run_game:{ru:"\u0412\u0430\u043C \u043D\u0443\u0436\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440 Stage \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u043F\u0443\u0441\u043A\u043E\u043C \u0438\u0433\u0440\u044B.",en:"You need create Stage instance before run game."},need_create_stage_before_sprite:{ru:"\u0412\u0430\u043C \u043D\u0443\u0436\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440 \u043A\u043B\u0430\u0441\u0441\u0430 Stage \u043F\u0435\u0440\u0435\u0434 \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u043E\u043C \u043A\u043B\u0430\u0441\u0441\u0430 Sprite.",en:"You need create Stage instance before Sprite instance."},costume_not_loaded:{ru:'\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u043A\u043E\u0441\u0442\u044E\u043C\u0430 "${costumePath}" \u043D\u0435 \u0431\u044B\u043B\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043F\u0443\u0442\u0438.',en:'Costume image "${costumePath}" was not loaded. Check that the path is correct.'},background_not_loaded:{ru:'\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0444\u043E\u043D\u0430 "${backgroundPath}" \u043D\u0435 \u0431\u044B\u043B\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043F\u0443\u0442\u0438.',en:'Background image "${backgroundPath}" was not loaded. Check that the path is correct.'},cloned_not_ready:{ru:"\u0421\u043F\u0440\u0430\u0439\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043A\u043B\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u043D \u0435\u0449\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u0442\u043E\u0434 sprite.onReady()",en:"Sprite cannot be cloned because one is not ready. Try using the sprite.onReady() method."},sound_index_not_found:{ru:'\u0417\u0432\u0443\u043A \u0441 \u0438\u043D\u0434\u0435\u043A\u0441\u043E\u043C "${soundIndex}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'Sound with index "${soundIndex}" not found.'},sound_name_not_found:{ru:'\u0417\u0432\u0443\u043A \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${soundName}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'Sound with name "${soundName}" not found.'},sound_name_already_exists:{ru:'\u0417\u0432\u0443\u043A \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${soundName}" \u0443\u0436\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D.',en:'Sound with name "${soundName}" already exists.'},sound_use_not_ready:{ru:"\u0421\u043F\u0440\u0430\u0439\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0437\u0432\u0443\u043A\u0438, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0441\u043F\u0440\u0430\u0439\u0442 \u0435\u0449\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u0442\u043E\u0434 sprite.onReady().",en:"Sprite cannot use sounds because sprite is not ready. Try using the sprite.onReady() method."},sound_not_allowed_error:{ru:"\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0437\u0432\u0443\u043A\u0430 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E. \u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441 \u0438\u0433\u0440\u043E\u0439. \u0412\u043E\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435\u0441\u044C \u043C\u0435\u0442\u043E\u0434\u043E\u043C Game.onUserInteracted()",en:"Audio playback is blocked. The user must first interact with the game. Use the Game.onUserInteracted() method."},costume_index_not_found:{ru:'\u041A\u043E\u0441\u0442\u044E\u043C \u0441 \u0438\u043D\u0434\u0435\u043A\u0441\u043E\u043C "${costumeIndex}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'Costume with index "${costumeIndex}" not found.'},costume_name_not_found:{ru:'\u041A\u043E\u0441\u0442\u044E\u043C \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${costumeName}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'Costume with name "${costumeName}" not found.'},costume_switch_not_ready:{ru:"\u0421\u043F\u0440\u0430\u0439\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043A\u043E\u0441\u0442\u044E\u043C, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0441\u043F\u0440\u0430\u0439\u0442 \u0435\u0449\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u0442\u043E\u0434 sprite.onReady().",en:"Sprite cannot change a costume because sprite is not ready. Try using the sprite.onReady() method."},stamp_not_ready:{ru:"\u0421\u043F\u0440\u0430\u0439\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0448\u0442\u0430\u043C\u043F, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u043D \u0435\u0449\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u0442\u043E\u0434 sprite.onReady()",en:"Sprite cannot create a stamp because sprite is not ready. Try using the sprite.onReady() method."},stamp_costume_not_found:{ru:'\u0428\u0442\u0430\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0441\u043E\u0437\u0434\u0430\u043D, \u0442\u0430\u043A \u043A\u0430\u043A \u043A\u043E\u0441\u0442\u044E\u043C \u0441 \u0438\u043D\u0434\u0435\u043A\u0441\u043E\u043C "${costumeIndex}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'The stamp cannot be created because the costume with the index "${costumeIndex}" has not been found.'},collider_name_not_found:{ru:'\u041A\u043E\u043B\u043B\u0430\u0439\u0434\u0435\u0440 \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${colliderName}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.',en:'Collider with name "${colliderName}" not found.'}};var y=E;var bt=class bt{static getChar(t){return bt.map[t]}};bt.map=["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","ENTER_SPECIAL","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","OS_KEY","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","SEMICOLON","EQUALS","COMMA","MINUS","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];var I=bt;var at=class{constructor(){this.keys={};document.addEventListener("keydown",t=>{let e=I.getChar(t.keyCode);this.keys[e]=!0}),document.addEventListener("keyup",t=>{let e=I.getChar(t.keyCode);delete this.keys[e]})}keyPressed(t){return this.keys[t.toUpperCase()]!==void 0}keyDown(t,e){document.addEventListener("keydown",i=>{let s=I.getChar(i.keyCode);t.toUpperCase()==s&&e(i)})}keyUp(t,e){document.addEventListener("keyup",i=>{let s=I.getChar(i.keyCode);t.toUpperCase()==s&&e(i)})}};var lt=class{constructor(t){this.x=0;this.y=0;this.isDown=!1;document.addEventListener("mousedown",()=>{this.isDown=!0,this.lastStage=t.getActiveStage()}),document.addEventListener("mouseup",()=>{this.isDown=!1}),document.addEventListener("mousemove",e=>{this.x=t.correctMouseX(e.clientX),this.y=t.correctMouseY(e.clientY)}),this.point=new N(this.x,this.y)}getPoint(){return this.point.x=this.x,this.point.y=this.y,this.point}isMouseDown(t){return this.isDown&&t===this.lastStage}clearMouseDown(){this.isDown=!1}};var O=class c{constructor(){this.data={}}static getInstance(){return this.instance||(this.instance=new c),this.instance}set(t,e){this.data[t]=e}has(t){return this.data[t]!==void 0}get(t){return this.data[t]}};var ht=class{constructor(t,e,i){this.canvas=t,this.setEnvironmentStyles(),this.setCanvasSize(e,i),this.canvasRect=t.getBoundingClientRect(),window.addEventListener("resize",()=>{this.setCanvasSize(e,i),this.canvasRect=t.getBoundingClientRect()})}setEnvironmentStyles(){document.body.style.margin="0",document.body.style.height="100vh",document.body.style.padding="0",document.body.style.overflow="hidden"}setCanvasSize(t,e){this.canvas.width=t||document.body.clientWidth,this.canvas.height=e||document.body.clientHeight}};var ct=class c{constructor(t){this.game=t}createValidator(t,e){let i=this.game;return new Proxy(t,{get(s,n){if(n in s)return s[n];if(typeof n=="symbol"||n.startsWith("_"))return;let r=Object.getOwnPropertyNames(Object.getPrototypeOf(s)).filter(a=>a!=="constructor"),o=c.findClosestMethods(n.toString(),r);if(o.length){let a=o.join(", ");i.throwError(y.MISTAKE_METHOD_WITH_CLOSEST,{className:e,prop:n,closestString:a})}else i.throwError(y.MISTAKE_METHOD,{className:e,prop:n})}})}static findClosestMethods(t,e,i=2){return e.map(s=>({name:s,distance:c.levenshteinDistance(t.toLowerCase(),s.toLowerCase())})).filter(({distance:s})=>s<=i).sort((s,n)=>s.distance-n.distance).map(({name:s})=>s).slice(0,3)}static levenshteinDistance(t,e){let i=Array(t.length+1).fill(null).map(()=>Array(e.length+1).fill(0));for(let s=0;s<=t.length;s++)i[s][0]=s;for(let s=0;s<=e.length;s++)i[0][s]=s;for(let s=1;s<=t.length;s++)for(let n=1;n<=e.length;n++){let r=t[s-1]===e[n-1]?0:1;i[s][n]=Math.min(i[s-1][n]+1,i[s][n-1]+1,i[s-1][n-1]+r)}return i[t.length][e.length]}};var z=class{constructor(){this.ready=!1}get width(){return this.image instanceof HTMLCanvasElement?this.image.width:0}get height(){return this.image instanceof HTMLCanvasElement?this.image.height:0}};var U=class{constructor(){this.callbacksMap=new Map;this.eventTarget=new EventTarget}once(t,e,i){if(this.callbacksMap.get(t))return!1;let s=n=>{typeof i=="function"?i(n):i.handleEvent(n),this.eventTarget.removeEventListener(e,s),this.remove(t)};return this.eventTarget.addEventListener(e,s),this.callbacksMap.set(t,{type:e,callback:s}),!0}on(t,e,i){return this.callbacksMap.get(t)?!1:(this.eventTarget.addEventListener(e,i),this.callbacksMap.set(t,{type:e,callback:i}),!0)}emit(t,e){this.eventTarget.dispatchEvent(new CustomEvent(t,{detail:e}))}remove(t){let e=this.callbacksMap.get(t);return e?(this.eventTarget.removeEventListener(e.type,e.callback),this.callbacksMap.delete(t),!0):!1}removeByType(t){this.callbacksMap.forEach((e,i)=>{t===e.type&&(this.eventTarget.removeEventListener(e.type,e.callback),this.callbacksMap.delete(i))})}clearAll(){this.callbacksMap.forEach(t=>{this.eventTarget.removeEventListener(t.type,t.callback)}),this.callbacksMap.clear()}};var J=class J{constructor(t=null,e=null,i=null,s=!0,n="ru"){this.debugMode="none";this.debugCollider=!1;this.debugColor="red";this.stages=[];this.activeStage=null;this.styles=null;this.loadedStages=0;this.onReadyCallbacks=[];this.onUserInteractedCallbacks=[];this.onReadyPending=!0;this.running=!1;this.pendingRun=!1;this.reportedError=!1;this._displayErrors=!0;this._locale="ru";this._userInteracted=!1;this._displayErrors=s,this._locale=n,this.validatorFactory=new ct(this);let r=this;if(this.displayErrors&&(r=this.validatorFactory.createValidator(this,"Game")),window.onerror=()=>{r.reportError(y.getMessage(y.SCRIPT_ERROR,r._locale))},r.id=Symbol(),r.eventEmitter=new U,r.keyboard=new at,i){let o=document.getElementById(i);o instanceof HTMLCanvasElement&&(r.canvas=o)}else r.canvas=document.createElement("canvas"),document.body.appendChild(r.canvas);return r.canvas.width=t,r.canvas.height=e,r.styles=new ht(r.canvas,t,e),r.mouse=new lt(r),r.context=r.canvas.getContext("2d"),O.getInstance().set("game",r),r.addListeners(),r}addStage(t){return this.stages.push(t),this}getLastStage(){return this.stages.length?this.stages[this.stages.length-1]:null}getActiveStage(){return this.activeStage?this.activeStage:null}run(t=null){if(!t&&this.stages.length&&(t=this.stages[0]),t||this.throwError(y.NEED_STAGE_BEFORE_RUN_GAME),!this.running)for(let e of this.stages)e.ready();this.activeStage&&this.activeStage.running&&this.activeStage.stop(),this.running=!1,this.pendingRun=!0,this.activeStage=t,this.tryDoRun()}isReady(){return this.loadedStages==this.stages.length}onReady(t){this.onReadyCallbacks.push(t)}onUserInteracted(t){this.onUserInteractedCallbacks.push(t)}stop(){this.activeStage&&this.activeStage.running&&this.activeStage.stop(),this.running=!1}get displayErrors(){return this._displayErrors}get locale(){return this._locale}get width(){return this.canvas.width}get height(){return this.canvas.height}get userInteracted(){return this._userInteracted}isInsideGame(t,e){return t>=0&&t<=this.width&&e>=0&&e<=this.height}correctMouseX(t){return t-this.styles.canvasRect.left}correctMouseY(t){return t-this.styles.canvasRect.top}keyPressed(t){if(Array.isArray(t)){for(let e of t)if(this.keyboard.keyPressed(e))return!0;return!1}return this.keyboard.keyPressed(t)}keyDown(t,e){this.keyboard.keyDown(t,e)}keyUp(t,e){this.keyboard.keyUp(t,e)}mouseDown(){return this.mouse.isMouseDown(this.activeStage)}mouseDownOnce(){let t=this.mouse.isMouseDown(this.activeStage);return this.mouse.clearMouseDown(),t}getMousePoint(){return this.mouse.getPoint()}getRandom(t,e){return Math.floor(Math.random()*(e-t+1))+t}throwError(t,e=null,i=!0){let s=y.getMessage(t,this.locale,e);this.throwErrorRaw(s,i)}throwErrorRaw(t,e=!0){throw e&&this.reportError(t),new Error(t)}reportError(t){this._displayErrors&&!this.reportedError&&(alert(t),this.reportedError=!0)}addListeners(){this.eventEmitter.on(J.STAGE_READY_EVENT,J.STAGE_READY_EVENT,t=>{this.loadedStages++,this.tryDoOnReady()}),document.addEventListener("visibilitychange",()=>{document.hidden?this.activeStage&&this.activeStage.running&&this.activeStage.stop():this.activeStage&&this.activeStage.stopped&&this.activeStage.run()}),this.userInteractionPromise=new Promise(t=>{document.addEventListener("click",t,{once:!0}),document.addEventListener("keydown",e=>{["Control","Shift","CapsLock","NumLock","Alt","Meta"].includes(e.key)||t(!0)},{once:!0})})}tryDoOnReady(){if(this.isReady()&&this.onReadyPending){if(this.onReadyPending=!1,this.onReadyCallbacks.length){for(let t of this.onReadyCallbacks)t();this.onReadyCallbacks=[]}this.userInteractionPromise.then(()=>{this._userInteracted=!0,this.onUserInteractedCallbacks.filter(t=>(t(this),!1))}),this.tryDoRun()}}tryDoRun(){this.pendingRun&&!this.running&&this.isReady()&&(this.running=!0,this.pendingRun=!1,this.activeStage.run())}};J.STAGE_READY_EVENT="scrubjs.stage.ready",J.STAGE_BACKGROUND_READY_EVENT="scrubjs.stage.background_ready",J.SPRITE_READY_EVENT="scrubjs.sprite.ready";var R=J;var Y=class{constructor(t,e,i,s){this.callback=t,this.state=e,this.timeout=i,this.finishCallback=s}};var H=class{constructor(t,e,i){this.interval=t,this.maxIterations=e,this.currentIteration=i}};var $=class c{constructor(t,e=0,i=[]){this.name="No name";this.game=null;this.stage=null;this._parentSprite=null;this._collidedSprite=null;this._original=null;this.costumeIndex=null;this.costume=null;this.costumes=[];this.costumeNames=[];this.sounds=[];this.soundNames=[];this.currentColliderName=null;this.colliders=new Map;this.phrase=null;this.phraseLiveTime=null;this._x=0;this._y=0;this._pivotOffsetX=0;this._pivotOffsetY=0;this._width=0;this._height=0;this._defaultColliderNone=!1;this._direction=0;this._size=100;this._centerDistance=0;this._centerAngle=0;this._rotateStyle="normal";this._hidden=!1;this._opacity=null;this._filter=null;this._deleted=!1;this._stopped=!0;this.pendingCostumeGrids=0;this.pendingCostumes=0;this.pendingSounds=0;this._children=[];this.onReadyCallbacks=[];this.onReadyPending=!0;this.scheduledCallbacks=[];this.tempScheduledCallbacks=[];this._drawings=[];this._tags=[];if(!O.getInstance().has("game"))throw new Error("You need create Game instance before Stage instance.");this.game=O.getInstance().get("game");let s=this;this.game.displayErrors&&(s=this.game.validatorFactory.createValidator(this,"Sprite")),s.id=Symbol(),s.eventEmitter=new U,s.collisionResult=new T,s.stage=t,this.stage||(s.stage=this.game.getLastStage()),s.stage||s.game.throwError(y.NEED_CREATE_STAGE_BEFORE_SPRITE),s._layer=e,s._x=s.game.width/2,s._y=s.game.height/2;for(let n of i)s.addCostume(n);return s.scheduledCallbackExecutor=new V(s),s.stage.addSprite(s),s.init(),s}init(){}onReady(t){this.onReadyCallbacks.push(t)}isReady(){return this.pendingCostumes===0&&this.pendingCostumeGrids===0&&this.pendingSounds===0}get deleted(){return this._deleted}get stopped(){return this._stopped}setParent(t){return t.addChild(this),this}addChild(t){if(!this._children.includes(t)){this._children.push(t),t.parent=this,t.layer=this.layer,t.x=0,t.y=0,t.direction=0;for(let e of this.tags)t.addTag(e)}return t.parent=this,this}removeChild(t){let e=this._children.indexOf(t);if(e>-1){let i=this._children[e];i.parent=null;for(let s of this.tags)i.removeTag(s);this._children.splice(e,1)}return this}getChildren(){return this._children}set parent(t){this._parentSprite=t}get parent(){return this._parentSprite}getMainSprite(){return this._parentSprite?this._parentSprite.getMainSprite():this}switchCollider(t){if(this.colliders.has(t)||this.game.throwError(y.COLLIDER_NAME_NOT_FOUND,{colliderName:t}),this.currentColliderName===t)return this;let e=this.collider;e&&this.stage.collisionSystem.remove(e),this.currentColliderName=t;let i=this.collider;return this.stage.collisionSystem.insert(i),this._width=i.width,this._height=i.height,this}setCollider(t,e,i=0,s=0){if(e.parentSprite=this,e.offset_x=i,e.offset_y=s,this.currentColliderName===t&&this.colliders.has(t)){let n=this.colliders.get(t);this.stage.collisionSystem.remove(n),this.currentColliderName=null}return this.colliders.set(t,e),this.updateColliderPosition(e),this.isReady()&&!this.collider&&this.switchCollider(t),this}setRectCollider(t,e,i,s=0,n=0){let r=0;this._rotateStyle!="leftRight"&&(r=this.globalAngleRadians);let o=new w(this.x,this.y,[[e/2*-1,i/2*-1],[e/2,i/2*-1],[e/2,i/2],[e/2*-1,i/2]],r,this.size/100,this.size/100);return o.width=e,o.height=i,this.setCollider(t,o,s,n),this}setPolygonCollider(t,e,i=0,s=0){let n=0;this._rotateStyle!="leftRight"&&(n=this.globalAngleRadians);let r=this.calculateCentroid(e),o=e.map(u=>[u[0]-r.x,u[1]-r.y]),a=new w(this.x,this.y,o,n,this.size/100,this.size/100),{width:l,height:h}=this.calculatePolygonSize(o);return a.width=l,a.height=h,this.setCollider(t,a,i,s),this}setCircleCollider(t,e,i=0,s=0){let n=new F(this.x,this.y,e,this.size/100);return n.width=e*2,n.height=e*2,this.setCollider(t,n,i,s),this}setCostumeCollider(t,e=0,i=0,s=0){this.costumes[e]===void 0&&this.game.throwError(y.COSTUME_INDEX_NOT_FOUND,{costumeIndex:e});let n=this.costumes[e];return this.setRectCollider(t,n.width,n.height,i,s),this}removeCollider(t){if(t)this.removeColliderByName(t);else{let e=this.collider;e&&this.stage.collisionSystem.remove(e),this.colliders.clear(),this.currentColliderName=null,this.defaultColliderNone=!0}return this}removeColliderByName(t){let e=this.getCollider(t);if(this.colliders.delete(t),this.colliders.size===0&&(this.defaultColliderNone=!0),t===this.currentColliderName&&(this.stage.collisionSystem.remove(e),this.colliders.size)){let i=this.colliders.keys().next().value;this.switchCollider(i)}return this}getCollider(t){return this.colliders.has(t)||this.game.throwError(y.COLLIDER_NAME_NOT_FOUND,{colliderName:t}),this.colliders.get(t)}hasCollider(t){return this.colliders.has(t)}get collider(){return this.currentColliderName&&this.colliders.has(this.currentColliderName)?this.colliders.get(this.currentColliderName):null}get collidedSprite(){return this._collidedSprite}set defaultColliderNone(t){this._defaultColliderNone=t}get defaultColliderNone(){return this._defaultColliderNone}getColliders(){return this.colliders.entries()}cloneCollider(t){let e=t.getColliders();for(let[i,s]of e)s instanceof F&&this.setCircleCollider(i,s.radius,s.offset_x,s.offset_y),s instanceof w&&this.setPolygonCollider(i,s.points,s.offset_x,s.offset_y)}calculateCentroid(t){let e=0,i=0;for(let r of t)e+=r[0],i+=r[1];let s=e/t.length,n=i/t.length;return{x:s,y:n}}calculatePolygonSize(t){let e=t[0][0],i=t[0][1],s=t[0][0],n=t[0][1];for(let a of t)a[0]<e&&(e=a[0]),a[0]>s&&(s=a[0]),a[1]<i&&(i=a[1]),a[1]>n&&(n=a[1]);let r=s-e,o=n-i;return{width:r,height:o}}updateColliderPosition(t){t.x=this.imageCenterX+t.center_offset_x*this.size/100,t.y=this.imageCenterY+t.center_offset_y*this.size/100}updateColliderAngle(){let t=this.collider;t instanceof w&&(this._rotateStyle=="leftRight"?t.angle=0:t.angle=this.globalAngleRadians),t&&this.updateColliderPosition(t)}updateColliderSize(t){t instanceof w?(t.scale_x=this.size/100,t.scale_y=this.size/100):t instanceof F&&(t.scale=this.size/100)}addTag(t){this.hasTag(t)||this._tags.push(t);for(let e of this._children)e.addTag(t);return this}removeTag(t){let e=this._tags.indexOf(t);e>-1&&this._tags.splice(e,1);for(let i of this._children)i.addTag(t);return this}hasTag(t){return this._tags.includes(t)}get tags(){return this._tags}addCostume(t,e){let i=new z,s=this.costumes.length,n=(e?.name??"Costume")+"-"+s;this.costumes.push(i),this.costumeNames.push(n),this.pendingCostumes++;let r=new Image;r.src=t,e?.alphaColor&&(r.crossOrigin="anonymous");let o=()=>{if(this.deleted)return;let a=this.transformImage(r,e?.rotate??0,e?.flipX??!1,e?.flipY??!1,e?.x??0,e?.y??0,e?.width??r.naturalWidth,e?.height??r.naturalHeight,e?.alphaColor??null,e?.alphaTolerance??0,e?.crop??0,e?.cropTop??null,e?.cropRight??null,e?.cropBottom??null,e?.cropLeft??null);i.image=a,i.ready=!0,this.pendingCostumes--,this.tryDoOnReady(),r.removeEventListener("load",o)};return r.addEventListener("load",o),r.addEventListener("error",()=>{this.game.throwError(y.COSTUME_NOT_LOADED,{costumePath:t})}),this}addCostumeGrid(t,e){let i=new Image;i.src=t;let s=e?.name??"Costume";this.pendingCostumeGrids++;let n=()=>{i.naturalWidth,i.naturalHeight;let r=e.cols,o=e.rows,a=e.limit,l=e.offset,h=i.naturalWidth/r,u=i.naturalHeight/o,d=!1,_=0,p=0,m=0;for(let f=0;f<o;f++){for(let b=0;b<r;b++){if(d=!1,l!==null&&l>0&&(l--,d=!0),!d){if(a!==null){if(a==0)break;a>0&&a--}let v=new z;this.costumes.push(v),this.costumeNames.push(s+"-"+_);let C=this.transformImage(i,e?.rotate??0,e?.flipX??!1,e?.flipY??!1,p+(e?.x??0),m+(e?.y??0),e?.width??h,e?.height??u,e?.alphaColor??null,e?.alphaTolerance??0,e?.crop??0,e?.cropTop??null,e?.cropRight??null,e?.cropBottom??null,e?.cropLeft??null);v.image=C,v.ready=!0,_++}p+=h}p=0,m+=u}this.pendingCostumeGrids--,this.tryDoOnReady(),i.removeEventListener("load",n)};return i.addEventListener("load",n),this}drawCostume(t,e){let i=document.createElement("canvas"),s=i.getContext("2d");i.width=e?.width??100,i.height=e?.height??100,this.pendingCostumes++,t(s,this);let n=this.costumes.length,r=(e?.name??"Costume")+"-"+n;Object.values(e||{}).some(l=>!!l)&&(i=this.transformImage(i,e?.rotate??0,e?.flipX??!1,e?.flipY??!1,e?.x??0,e?.y??0,e?.width??i.width,e?.height??i.height,e?.alphaColor??null,e?.alphaTolerance??0,e?.crop??0,e?.cropTop??null,e?.cropRight??null,e?.cropBottom??null,e?.cropLeft??null));let a=new z;return a.image=i,a.ready=!0,this.costumes.push(a),this.costumeNames.push(r+"-"+n),this.pendingCostumes--,this}removeCostume(t){return this.costumes[t]===void 0&&this.game.throwError(y.COSTUME_INDEX_NOT_FOUND,{costumeIndex:t}),this.costumes.splice(t,1),this.costumeNames.splice(t,1),this.costumeIndex===t&&(this.costumeIndex=null,this.costumes.length>0?this.nextCostume():this.costume=null),this}switchCostume(t){if(this.deleted)return;this.isReady()||this.game.throwError(y.COSTUME_SWITCH_NOT_READY);let e=this.costumes[t];return e instanceof z&&e.ready&&(this.costumeIndex=t,this.costume=e),this}switchCostumeByName(t){this.isReady()||this.game.throwError(y.COSTUME_SWITCH_NOT_READY);let e=this.costumeNames.indexOf(t);return e>-1?this.switchCostume(e):this.game.throwError(y.COSTUME_NAME_NOT_FOUND,{costumeName:t}),this}nextCostume(t=0,e){if(this.deleted)return;this.isReady()||this.game.throwError(y.COSTUME_SWITCH_NOT_READY);let i=this.costumes.length-1;t=Math.min(i,Math.max(0,t)),e=Math.min(i,Math.max(0,e??i));let s=this.costumeIndex+1;return(s>e||s<t)&&(s=t),s!==this.costumeIndex&&this.switchCostume(s),s}prevCostume(t=0,e){if(this.deleted)return;this.isReady()||this.game.throwError(y.COSTUME_SWITCH_NOT_READY);let i=this.costumes.length-1;t=Math.min(i,Math.max(0,t)),e=Math.min(i,Math.max(0,e??i));let s=this.costumeIndex-1;return(s<t||s>e)&&(s=e),s!==this.costumeIndex&&this.switchCostume(s),s}getCostume(){return this.costume}getCostumeName(){return this.costumeIndex===null?"No costume":this.costumeNames[this.costumeIndex]}getCostumeIndex(){return this.costumeIndex}transformImage(t,e,i=!1,s=!1,n=0,r=0,o=null,a=null,l=null,h=0,u=0,d=null,_=null,p=null,m=null){d=d??u,_=_??u,p=p??u,m=m??u,n+=_,o-=_,o-=m,r+=d,a-=d,a-=p;let f=document.createElement("canvas"),b=f.getContext("2d"),v=e*Math.PI/180,C=o??(t instanceof HTMLImageElement?t.naturalWidth:t.width),S=a??(t instanceof HTMLImageElement?t.naturalHeight:t.height);if(e){let B=Math.abs(Math.cos(v)),q=Math.abs(Math.sin(v));C=C*B+S*q,S=C*q+S*B}f.width=Math.ceil(C),f.height=Math.ceil(S),b.translate(f.width/2,f.height/2),e&&b.rotate(v),(i||s)&&b.scale(i?-1:1,s?-1:1);let x=-o/2,A=-a/2;return b.drawImage(t,n,r,o,a,x,A,o,a),l&&(f=this.setAlpha(f,l,h??0)),f}setAlpha(t,e,i=0){let s=document.createElement("canvas"),n=s.getContext("2d");if(!n)throw new Error("Canvas context is not available");s.width=t.width,s.height=t.height;let r=t.getContext("2d").getImageData(0,0,t.width,t.height),o=r.data,a;if(typeof e=="string"){if(a=this.hexToRgb(e),!a)throw new Error(`Invalid HEX color: ${e}`)}else a=e;for(let l=0;l<o.length;l+=4){let h=o[l],u=o[l+1],d=o[l+2];Math.abs(h-a.r)<=i&&Math.abs(u-a.g)<=i&&Math.abs(d-a.b)<=i&&(o[l+3]=0)}return n.putImageData(r,0,0),s}hexToRgb(t){if(t=t.replace(/^#/,""),t.length===3&&(t=t.split("").map(i=>i+i).join("")),t.length!==6)return null;let e=parseInt(t,16);return{r:e>>16&255,g:e>>8&255,b:e&255}}cloneCostume(t,e){this.costumes.push(t),this.costumeNames.push(e)}addSound(t,e){this.soundNames.includes(e)&&this.game.throwError(y.SOUND_NAME_ALREADY_EXISTS,{soundName:e});let i=new Audio;i.src=t,this.sounds.push(i),this.soundNames.push(e),this.pendingSounds++,i.load();let s=()=>{this.pendingSounds--,this.tryDoOnReady(),i.removeEventListener("loadedmetadata",s)};return i.addEventListener("loadedmetadata",s),this}removeSound(t){let e=this.soundNames.indexOf(t);return e<0&&this.game.throwError(y.SOUND_NAME_NOT_FOUND,{soundName:t}),this.sounds.splice(e,1),this}playSound(t,e={}){let i=this.getSound(t);this.doPlaySound(i,e)}startSound(t,e={}){let i=this.cloneSound(t);return this.doPlaySound(i,e),i}pauseSound(t){this.getSound(t).pause()}getSound(t){this.isReady()||this.game.throwError(y.SOUND_USE_NOT_READY);let e=this.soundNames.indexOf(t);e<0&&this.game.throwError(y.SOUND_NAME_NOT_FOUND,{soundName:t});let i=this.sounds[e];return i instanceof Audio||this.game.throwError(y.SOUND_INDEX_NOT_FOUND,{soundIndex:e}),i}cloneSound(t){let e=this.getSound(t);return new Audio(e.src)}doPlaySound(t,e={}){e.volume!==void 0&&(t.volume=e.volume),e.currentTime!==void 0&&(t.currentTime=e.currentTime),e.loop!==void 0&&(t.loop=e.loop);let i=t.play();i!==void 0&&i.catch(s=>{s.name==="NotAllowedError"?this.game.throwError(y.SOUND_NOT_ALLOWED_ERROR,{},!1):console.error("Audio playback error:",s)})}stamp(t,e=!0){this.isReady()||this.game.throwError(y.STAMP_NOT_READY),t=t??this.costumeIndex,this.costumes[t]||this.game.throwError(y.STAMP_COSTUME_NOT_FOUND,{costumeIndex:t});let i=this.costumes[t];i.image instanceof HTMLCanvasElement||this.game.throwErrorRaw("The image inside the costume was not found.");let s=0;e&&this._rotateStyle==="normal"&&(s=this.direction),this.stage.stampImage(i.image,this.x,this.y,s)}pen(t){this._drawings.push(t)}get drawings(){return this._drawings}set opacity(t){t===null?this._opacity=null:this._opacity=Math.min(1,Math.max(0,t))}get opacity(){return this._opacity}set filter(t){this._filter=t}get filter(){return this._filter}set rotateStyle(t){this._rotateStyle=t;for(let e of this._children)e.rotateStyle=t}get rotateStyle(){return this._rotateStyle}set layer(t){this.stage.changeSpriteLayer(this,this._layer,t),this._layer=t;for(let e of this._children)e.layer=e.layer+this._layer}get layer(){return this._layer}set hidden(t){this._hidden=t;for(let e of this._children)e.hidden=t}get hidden(){return this._hidden}say(t,e){if(this.phrase=this.name+": "+t,this.phraseLiveTime=null,e){let i=new Date().getTime();this.phraseLiveTime=i+e}}getPhrase(){if(this.phrase){if(this.phraseLiveTime===null)return this.phrase;let t=new Date().getTime();if(this.phraseLiveTime>t)return this.phrase;this.phrase=null,this.phraseLiveTime=null}return null}move(t){let e=this.globalAngleRadians;this.x+=t*Math.sin(e),this.y-=t*Math.cos(e)}pointForward(t){let e=t.globalX?t.globalX:t.x,i=t.globalY?t.globalY:t.y;this.globalDirection=Math.atan2(this.globalY-i,this.globalX-e)/Math.PI*180-90}getDistanceTo(t){let e=t.globalX?t.globalX:t.x,i=t.globalY?t.globalY:t.y;return Math.sqrt(Math.abs(this.globalX-e)+Math.abs(this.globalY-i))}bounceOnEdge(){(this.touchTopEdge()||this.touchBottomEdge())&&(this.direction=180-this.direction),(this.touchLeftEdge()||this.touchRightEdge())&&(this.direction*=-1)}set x(t){this._x=t,this._children.length&&this.updateCenterParams();let e=this.collider;e&&this.updateColliderPosition(e);for(let i of this._children)i.collider&&i.updateColliderPosition(i.collider)}get x(){return this._x}set y(t){this._y=t,this._children.length&&this.updateCenterParams();let e=this.collider;e&&this.updateColliderPosition(e);for(let i of this._children)i.collider&&i.updateColliderPosition(i.collider)}get y(){return this._y}get globalX(){return this._parentSprite?this._rotateStyle==="leftRight"||this._rotateStyle==="none"?this._parentSprite.imageCenterX+this._x*this.size/100:this._parentSprite.imageCenterX+this.distanceToParent*Math.cos(this.angleToParent-this._parentSprite.globalAngleRadians)*this.size/100:this._x}get globalY(){return this._parentSprite?this._rotateStyle==="leftRight"||this._rotateStyle==="none"?this._parentSprite.imageCenterY+this._y:this._parentSprite.imageCenterY-this.distanceToParent*Math.sin(this.angleToParent-this._parentSprite.globalAngleRadians)*this.size/100:this._y}get imageCenterX(){if(this._rotateStyle==="leftRight"||this._rotateStyle==="none"){let t=this._direction>180&&this._rotateStyle==="leftRight"?-1:1;return this.globalX-this._pivotOffsetX*t*this.size/100}return this.globalX+Math.cos(this._centerAngle-this.globalAngleRadians)*this._centerDistance*this.size/100}get imageCenterY(){return this._rotateStyle==="leftRight"||this._rotateStyle==="none"?this.globalY-this._pivotOffsetY*this.size/100:this.globalY-Math.sin(this._centerAngle-this.globalAngleRadians)*this._centerDistance*this.size/100}get realX(){return this.x-this.width/2}get realY(){return this.y-this.height/2}get rightX(){let t=this.collider,e=t?t.center_offset_x*this.size/100:0;return this.imageCenterX+this.width/2+e}set rightX(t){let e=this.collider,i=e?e.center_offset_x*this.size/100:0;this.x=t-this.width/2-i}get leftX(){let t=this.collider,e=t?t.center_offset_x*this.size/100:0;return this.imageCenterX-this.width/2+e}set leftX(t){let e=this.collider,i=e?e.center_offset_x*this.size/100:0;this.x=t+this.width/2+i}get topY(){let t=this.collider,e=t?t.center_offset_y*this.size/100:0;return this.imageCenterY-this.height/2+e}set topY(t){let e=this.collider,i=e?e.center_offset_y*this.size/100:0;this.y=t+this.height/2+i}get bottomY(){let t=this.collider,e=t?t.center_offset_y*this.size/100:0;return this.imageCenterY+this.height/2+e}set bottomY(t){let e=this.collider,i=e?e.center_offset_y*this.size/100:0;this.y=t-this.height/2-i}get width(){if(this.collider instanceof w){let t=this.globalAngleRadians;return Math.abs(this.sourceWidth*Math.cos(t))+Math.abs(this.sourceHeight*Math.sin(t))}return this.sourceWidth}get height(){if(this.collider instanceof w){let t=this.globalAngleRadians;return Math.abs(this.sourceWidth*Math.sin(t))+Math.abs(this.sourceHeight*Math.cos(t))}return this.sourceHeight}get sourceWidth(){return this._width*this.size/100}get sourceHeight(){return this._height*this.size/100}set size(t){this._size=t;let e=this.collider;e&&this.updateColliderSize(e);for(let i of this._children)i.size=t}get size(){return this._size}set direction(t){if(t*0===0){t=t%360,t<0&&(t+=360),this._direction=t>360?t-360:t,this.updateColliderAngle();for(let e of this._children)e.updateColliderAngle()}}get direction(){return this._direction}set globalDirection(t){this.direction=this._parentSprite?t-this._parentSprite.direction:t}get globalDirection(){return this._parentSprite?this._parentSprite.direction+this.direction:this.direction}get globalAngleRadians(){return this.globalDirection*Math.PI/180}get angleToParent(){return-Math.atan2(this.y,this.x)}get distanceToParent(){return Math.hypot(this.x,this.y)}setPivotOffset(t=0,e=0){return this.pivotOffsetX=t,this.pivotOffsetY=e,this}set pivotOffsetX(t){let e=this.x;this._pivotOffsetX=t,this.updateCenterParams(),this.x=e}get pivotOffsetX(){return this._pivotOffsetX}set pivotOffsetY(t){let e=this.y;this._pivotOffsetY=t,this.updateCenterParams(),this.y=e}get pivotOffsetY(){return this._pivotOffsetY}updateCenterParams(){this._centerDistance=Math.hypot(this._pivotOffsetX,this._pivotOffsetY),this._centerAngle=-Math.atan2(-this._pivotOffsetY,-this._pivotOffsetX)}touchSprite(t,e=!0){if(this._collidedSprite=null,t.hidden||this.hidden||t.stopped||this.stopped||t.deleted||this.deleted)return!1;let i=this.collider,s=t.collider;if(i&&s&&i.collides(s,this.collisionResult))return!0;if(i){for(let r of t.getChildren())if(this.touchSprite(r,!1))return!0}if(!e)return!1;for(let r of this._children){if(s&&r.touchSprite(t))return this._collidedSprite=r,!0;for(let o of t.getChildren())if(r.touchSprite(o))return this._collidedSprite=r,!0}return!1}touchSprites(t,e=!0){if(this.hidden||this.stopped||this.deleted)return!1;for(let i of t)if(this.touchSprite(i,e))return!0;return!1}touchMouse(t=!0){return this.touchPoint(this.game.getMousePoint(),t)}touchPoint(t,e=!0){if(this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;let i=this.collider;if(i&&i.collides(t,this.collisionResult))return!0;if(e){for(let n of this._children)if(n.touchPoint(n.game.getMousePoint()))return this._collidedSprite=n.otherSprite,!0}return!1}touchEdge(t=!0){let e=this.getPureCollisionResult();if(this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;if(this.collider){let i=this.game.width,s=this.game.height;if(this.topY<0)return e.collision=!0,e.overlap=-this.topY,e.overlap_y=-1,!0;if(this.bottomY>s)return e.collision=!0,e.overlap=this.bottomY-s,e.overlap_y=1,!0;if(this.leftX<0)return e.collision=!0,e.overlap=-this.leftX,e.overlap_x=-1,!0;if(this.rightX>i)return e.collision=!0,e.overlap=this.rightX-i,e.overlap_x=1,!0}if(t){for(let i of this._children)if(i.touchEdge())return this._collidedSprite=i,!0}return!1}touchTopEdge(t=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;if(this.collider&&this.topY<0)return this.collisionResult.collision=!0,this.collisionResult.overlap=-this.topY,this.collisionResult.overlap_y=-1,!0;if(t){for(let e of this._children)if(e.touchTopEdge())return this._collidedSprite=e,!0}return!1}touchBottomEdge(t=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;if(this.collider&&this.bottomY>this.game.height)return this.collisionResult.collision=!0,this.collisionResult.overlap=this.bottomY-this.game.height,this.collisionResult.overlap_y=1,!0;if(t){for(let e of this._children)if(e.touchBottomEdge())return this._collidedSprite=e,!0}return!1}touchLeftEdge(t=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;if(this.collider&&this.leftX<0)return this.collisionResult.collision=!0,this.collisionResult.overlap=-this.leftX,this.collisionResult.overlap_x=-1,!0;if(t){for(let e of this._children)if(e.touchLeftEdge())return this._collidedSprite=e,!0}return!1}touchRightEdge(t=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;if(this.collider&&this.rightX>this.game.width)return this.collisionResult.collision=!0,this.collisionResult.overlap=this.rightX-this.game.width,this.collisionResult.overlap_x=1,!0;if(t){for(let e of this._children)if(e.touchRightEdge())return this._collidedSprite=e,!0}return!1}touchTag(t,e=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;let i=this.collider;if(i){let s=i.potentials();if(!s.length)return!1;for(let n of s){let r=n.parentSprite;if(r&&r.hasTag(t)&&!r.hidden&&!r.stopped&&!r.deleted&&i.collides(n,this.collisionResult))return!0}}if(e){for(let s of this._children)if(s.touchTag(t))return this._collidedSprite=s,!0}return!1}touchTagAll(t,e=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;let i=[],s=this.collider;if(s){let n=s.potentials();if(!n.length)return!1;for(let r of n){let o=r.parentSprite;o&&o.hasTag(t)&&!o.hidden&&!o.stopped&&!o.deleted&&o.collider&&s.collides(r,this.collisionResult)&&i.push(o)}}if(e)for(let n of this._children){let r=n.touchTagAll(t);if(r&&!r.length)for(let o of r)i.push(o)}return i.length?i:!1}touchAnySprite(t=!0){if(this.clearCollisionResult(),this._collidedSprite=null,this.hidden||this.stopped||this.deleted)return!1;let e=this.collider;if(e){let i=e.potentials();if(!i.length)return!1;for(let s of i){let n=s.parentSprite;if(!n.hidden&&!n.stopped&&!n.deleted&&e.collides(s,this.collisionResult))return!0}}if(t){for(let i of this._children)if(i.touchAnySprite())return this._collidedSprite=i,!0}return!1}get overlap(){return this._collidedSprite?this._collidedSprite.overlap:this.collisionResult.collision?this.collisionResult.overlap:0}get overlapX(){return this._collidedSprite?this._collidedSprite.overlapX:this.collisionResult.collision?this.collisionResult.overlap_x*this.collisionResult.overlap:0}get overlapY(){return this._collidedSprite?this._collidedSprite.overlapY:this.collisionResult.collision?this.collisionResult.overlap_y*this.collisionResult.overlap:0}get otherSprite(){return this.collisionResult.collision?this.collisionResult.b.parentSprite:null}get otherMainSprite(){return this.collisionResult.collision?this.collisionResult.b.parentSprite.getMainSprite():null}clearCollisionResult(){this.collisionResult.collision=!1,this.collisionResult.a=null,this.collisionResult.b=null,this.collisionResult.a_in_b=!1,this.collisionResult.b_in_a=!1,this.collisionResult.overlap=0,this.collisionResult.overlap_x=0,this.collisionResult.overlap_y=0}getPureCollisionResult(){return this.clearCollisionResult(),this.collisionResult}timeout(t,e){this.repeat(t,1,null,e,void 0)}repeat(t,e,i,s,n){let r=new H(i,e,0);return s&&(s=Date.now()+s),this.tempScheduledCallbacks.push(new Y(t,r,s,n)),r}forever(t,e,i,s){let n=new H(e);return i&&(i=Date.now()+i),this.tempScheduledCallbacks.push(new Y(t,n,i,s)),n}update(t){this.deleted||(this.tempScheduledCallbacks.length&&(this.scheduledCallbacks=this.scheduledCallbacks.concat(this.tempScheduledCallbacks),this.tempScheduledCallbacks=[]),this.scheduledCallbacks=this.scheduledCallbacks.filter(this.scheduledCallbackExecutor.execute(Date.now(),t)))}run(){this._stopped=!1}stop(){this._stopped=!0}ready(){this.tryDoOnReady()}get original(){return this._original}setOriginal(t){this._original=t}createClone(t){this.isReady()||this.game.throwError(y.CLONED_NOT_READY),t||(t=this.stage);let e=new c(t,this.layer);e.setOriginal(this),e.name=this.name,e._rotateStyle=this._rotateStyle,e.x=this.x,e.y=this.y,e.pivotOffsetX=this.pivotOffsetX,e.pivotOffsetY=this.pivotOffsetY,e.direction=this.direction,e.size=this.size,e.hidden=this.hidden,e._deleted=this.deleted,e._stopped=this.stopped,e._tags.push(...this.tags),e.defaultColliderNone=this.defaultColliderNone;for(let i=0;i<this.costumes.length;i++)e.cloneCostume(this.costumes[i],this.costumeNames[i]);e.switchCostume(this.costumeIndex);for(let[i,s]of this.sounds.entries())e.sounds.push(s),e.soundNames.push(this.soundNames[i]);e.currentColliderName=null,e.cloneCollider(this),this.currentColliderName&&e.switchCollider(this.currentColliderName);for(let i of this._children){let s=i.createClone();e.addChild(s),s.x=i.x,s.y=i.y,s.direction=i.direction}return e.ready(),e}delete(){if(this.deleted)return;this.stage.removeSprite(this,this.layer),this.eventEmitter.clearAll(),this.removeCollider(),this.scheduledCallbackExecutor=null;for(let e of this._children)e.delete();let t=Object.keys(this);for(let e=0;e<t.length;e++)delete this[t[e]];this.costumes=[],this.costumeNames=[],this.sounds=[],this.soundNames=[],this.onReadyCallbacks=[],this.tempScheduledCallbacks=[],this.scheduledCallbacks=[],this._children=[],this._deleted=!0}deleteClones(){this.stage.getSprites().filter(e=>e.original===this).forEach(e=>e.delete())}tryDoOnReady(){if(this.onReadyPending&&this.isReady()){if(this.onReadyPending=!1,this.costumes.length&&this.costume===null&&this.switchCostume(0),!this.defaultColliderNone&&this.colliders.size===0&&this.costumes.length){let t="main";this.setCostumeCollider(t,0),this.switchCollider(t),this.updateColliderPosition(this.collider),this.updateColliderSize(this.collider)}if(!this.collider&&this.colliders.size){let t=this.colliders.keys().next().value;this.switchCollider(t),this.updateColliderPosition(this.collider),this.updateColliderSize(this.collider)}if(this.onReadyCallbacks.length){for(let t of this.onReadyCallbacks)t();this.onReadyCallbacks=[]}this.stage.eventEmitter.emit(R.SPRITE_READY_EVENT,{sprite:this,stageId:this.stage.id})}}};var V=class{constructor(t){this.context=t}execute(t,e){return i=>{let s=i.state;if(this.context instanceof $){if(this.context.deleted)return!1;if(this.context.stopped)return!0}if(i.timeout&&e&&(i.timeout+=e),!i.timeout||i.timeout<=t){let n=i.callback.bind(this.context)(this.context,s);if(s.maxIterations&&s.currentIteration++,n===!1||i.timeout&&!s.interval&&!s.maxIterations||s.maxIterations&&s.currentIteration>=s.maxIterations)return i.finishCallback&&i.finishCallback(this.context,s),!1;s.interval&&(i.timeout=t+s.interval)}return!0}}};var dt=class{constructor(){this.x=0;this.y=0;this.zoom=1;this.direction=0}reset(){this.x=0,this.y=0,this.zoom=1,this.direction=0}};var ut=class{constructor(t){this._direction=0;this._zoom=1;this.stage=t,this._x=this.stage.width/2,this._y=this.stage.height/2,this.updateRenderRadius(),this.changes=new dt}set direction(t){let e=t%360;e=e<0?e+360:e,this.changes.direction=e-this._direction,this._direction=e}get direction(){return this._direction}get angleDirection(){return this._direction*Math.PI/180}get width(){return this.stage.width/this._zoom}get height(){return this.stage.height/this._zoom}set x(t){this.changes.x=t-this._x,this._x=t}get x(){return this._x}set y(t){this.changes.y=t-this._y,this._y=t}get y(){return this._y}get startCornerX(){return this._x-this.stage.width/2}get startCornerY(){return this._y-this.stage.height/2}get renderRadius(){return this._renderRadius}set zoom(t){if(this.changes.zoom==1){let e=t<.1?.1:t;this.changes.zoom=e/this._zoom,this._zoom=e,this.updateRenderRadius()}}get zoom(){return this._zoom}updateRenderRadius(){this._renderRadius=Math.hypot(this.width,this.height)/1.7}};var Ot=class{constructor(t=null){this.background=null;this.backgroundIndex=null;this.backgrounds=[];this.sprites=new Map;this.drawings=new Map;this.sounds=[];this.soundNames=[];this.addedSprites=0;this.loadedSprites=0;this.pendingBackgrounds=0;this.pendingSounds=0;this.pendingRun=!1;this.onReadyPending=!0;this.onReadyCallbacks=[];this.onStartCallbacks=[];this.scheduledCallbacks=[];this.tempScheduledCallbacks=[];this._stopped=!0;this._running=!1;this.stoppedTime=null;this.diffTime=null;if(!O.getInstance().has("game"))throw new Error("You need create Game instance before Stage instance.");this.game=O.getInstance().get("game");let e=this;return this.game.displayErrors&&(e=this.game.validatorFactory.createValidator(this,"Stage")),e.id=Symbol(),e.eventEmitter=new U,e.collisionSystem=new ot,e.canvas=e.game.canvas,e.context=e.game.context,t&&e.addBackground(t),e.addListeners(),e.game.addStage(e),e.scheduledCallbackExecutor=new V(e),e.stoppedTime=Date.now(),e.init(),e.camera=new ut(e),e}init(){}onStart(t){this.onStartCallbacks.push(t)}onReady(t){this.onReadyCallbacks.push(t)}get running(){return this._running}get stopped(){return this._stopped}isReady(){return this.addedSprites==this.loadedSprites&&this.pendingBackgrounds===0}get width(){return this.canvas.width}get height(){return this.canvas.height}set backgroundColor(t){this.drawBackground((e,i)=>{e.fillStyle=t,e.fillRect(0,0,i.width,i.height)})}drawBackground(t){let e=document.createElement("canvas"),i=e.getContext("2d");return e.width=this.width,e.height=this.height,this.pendingBackgrounds++,t(i,this),this.backgrounds.push(e),this.pendingBackgrounds--,this}addBackground(t){let e=new Image;e.src=t,this.pendingBackgrounds++;let i=()=>{let s=document.createElement("canvas"),n=s.getContext("2d");s.width=this.width,s.height=this.height,n.drawImage(e,0,0,this.width,this.height),this.backgrounds.push(s),this.pendingBackgrounds--,this.tryDoOnReady(),this.tryDoRun(),e.removeEventListener("load",i)};return e.addEventListener("load",i),e.addEventListener("error",()=>{this.game.throwError(y.BACKGROUND_NOT_LOADED,{backgroundPath:t})}),this}switchBackground(t){this.backgroundIndex=t;let e=this.backgrounds[t];e&&(this.background=e)}nextBackground(){let t=this.backgroundIndex+1;t>this.backgrounds.length-1&&(t=0),t!==this.backgroundIndex&&this.switchBackground(t)}addSound(t,e){this.soundNames.includes(e)&&this.game.throwError(y.SOUND_NAME_ALREADY_EXISTS,{soundName:e});let i=new Audio;i.src=t,this.sounds.push(i),this.soundNames.push(e),this.pendingSounds++,i.load();let s=()=>{this.pendingSounds--,this.tryDoOnReady(),i.removeEventListener("loadedmetadata",s)};return i.addEventListener("loadedmetadata",s),this}removeSound(t){let e=this.soundNames.indexOf(t);return e<0&&this.game.throwError(y.SOUND_NAME_NOT_FOUND,{soundName:t}),this.sounds.splice(e,1),this}playSound(t,e={}){let i=this.getSound(t);this.doPlaySound(i,e)}startSound(t,e={}){let i=this.cloneSound(t);return this.doPlaySound(i,e),i}pauseSound(t){this.getSound(t).pause()}getSound(t){this.isReady()||this.game.throwError(y.SOUND_USE_NOT_READY);let e=this.soundNames.indexOf(t);e<0&&this.game.throwError(y.SOUND_NAME_NOT_FOUND,{soundName:t});let i=this.sounds[e];return i instanceof Audio||this.game.throwError(y.SOUND_INDEX_NOT_FOUND,{soundIndex:e}),i}cloneSound(t){let e=this.getSound(t);return new Audio(e.src)}doPlaySound(t,e={}){e.volume!==void 0&&(t.volume=e.volume),e.currentTime!==void 0&&(t.currentTime=e.currentTime),e.loop!==void 0&&(t.loop=e.loop);let i=t.play();i!==void 0&&i.catch(s=>{s.name==="NotAllowedError"?this.game.throwError(y.SOUND_NOT_ALLOWED_ERROR,{},!1):console.error("Audio playback error:",s)})}addSprite(t){let e;return this.sprites.has(t.layer)?e=this.sprites.get(t.layer):(e=[],this.sprites.set(t.layer,e)),e.push(t),this.addedSprites++,this}removeSprite(t,e){this.sprites.has(e)||this.game.throwErrorRaw('The layer "'+e+'" not defined in the stage.');let i=this.sprites.get(e);return i.splice(i.indexOf(t),1),i.length||this.sprites.delete(e),(t.deleted||t.isReady())&&this.loadedSprites--,this.addedSprites--,this}getSprites(){return Array.from(this.sprites.values()).reduce((t,e)=>t.concat(e),[])}changeSpriteLayer(t,e,i){this.sprites.has(e)||this.game.throwErrorRaw('The layer "'+e+'" not defined in the stage.');let s=this.sprites.get(e);s.splice(s.indexOf(t),1),s.length||this.sprites.delete(e);let n=[];this.sprites.has(i)?n=this.sprites.get(i):this.sprites.set(i,n),n.push(t)}drawSprite(t){let e=t.getCostume(),i=e.image,s=t.imageCenterX-t.sourceWidth/2,n=t.imageCenterY-t.sourceHeight/2,r=t.sourceWidth,o=t.sourceHeight,a=t.globalDirection,l=t.rotateStyle,h=(t.sourceWidth-e.width*t.size/100)/2,u=(t.sourceHeight-e.height*t.size/100)/2,d=l==="normal"&&a!==0||l==="leftRight"&&a>180||t.opacity!==null||t.filter!==null&&t.filter!="";d&&this.context.save(),t.opacity!==null&&(this.context.globalAlpha=t.opacity),t.filter&&(this.context.filter=t.filter),l==="normal"&&a!==0&&(this.context.translate(s+r/2,n+o/2),this.context.rotate(t.globalAngleRadians),this.context.translate(-s-r/2,-n-o/2)),l==="leftRight"&&a>180?(this.context.scale(-1,1),this.context.drawImage(i,0,0,e.width,e.height,-s-r+h,n+u,e.width*t.size/100,e.height*t.size/100)):this.context.drawImage(i,0,0,e.width,e.height,s+h,n+u,e.width*t.size/100,e.height*t.size/100),d&&this.context.restore()}stampImage(t,e,i,s=0){if(this.background instanceof HTMLCanvasElement){let n=document.createElement("canvas"),r=n.getContext("2d");n.width=this.width,n.height=this.height,r.drawImage(this.background,0,0,this.width,this.height);let o=t instanceof HTMLImageElement?t.naturalWidth:t.width,a=t instanceof HTMLImageElement?t.naturalHeight:t.height,l=e-o/2,h=i-a/2;if(s!==0){let u=s*Math.PI/180;r.translate(l+o/2,h+a/2),r.rotate(u),r.translate(-l-o/2,-h-a/2)}r.drawImage(t,l,h,o,a),this.background=n,this.backgrounds[this.backgroundIndex]=this.background}}pen(t,e=0){let i;this.drawings.has(e)?i=this.drawings.get(e):(i=[],this.drawings.set(e,i)),i.push(t)}timeout(t,e){this.repeat(t,1,null,e,void 0)}repeat(t,e,i=null,s=null,n){let r=new H(i,e,0);return s&&(s=Date.now()+s),this.tempScheduledCallbacks.push(new Y(t,r,s,n)),r}forever(t,e=null,i=null,s){let n=new H(e);return i&&(i=Date.now()+i),this.tempScheduledCallbacks.push(new Y(t,n,i,s)),n}render(){this.update(),this.collisionSystem.update(),this.context.clearRect(this.camera.startCornerX-this.camera.width/this.camera.zoom/2,this.camera.startCornerY-this.camera.height/this.camera.zoom/2,this.width+this.camera.width/this.camera.zoom,this.height+this.camera.height/this.camera.zoom),this.background&&this.context.drawImage(this.background,0,0,this.width,this.height);let t=Array.from(this.sprites.keys()).concat(Array.from(this.drawings.keys()));t=t.filter((s,n)=>t.indexOf(s)===n),t=t.sort((s,n)=>s-n);for(let s of t){if(this.drawings.has(s)){let n=this.drawings.get(s);for(let r of n)r(this.context,this)}if(this.sprites.has(s)){let n=this.sprites.get(s);for(let r of n){if(r.hidden)continue;let o=Math.hypot(r.imageCenterX-this.camera.x,r.imageCenterY-this.camera.y),a=Math.hypot(r.sourceWidth,r.sourceHeight)/2*this.camera.zoom;if(o>this.camera.renderRadius+a)continue;if(this.game.debugMode!=="none"){let h=()=>{let u=r.imageCenterX-this.context.measureText(r.name).width/2,d=r.imageCenterY+r.height+20;this.context.fillStyle=this.game.debugColor,this.context.font="16px Arial",this.context.fillText(r.name,u,d),d+=20,this.context.font="14px Arial",this.context.fillText("x: "+r.x,u,d),d+=20,this.context.fillText("y: "+r.y,u,d),d+=20,this.context.fillText("direction: "+r.direction,u,d),d+=20,this.context.fillText("costume: "+r.getCostumeName(),u,d),d+=20,this.context.fillText("xOffset: "+r.pivotOffsetX,u,d),d+=20,this.context.fillText("yOffset: "+r.pivotOffsetY,u,d),this.context.beginPath(),this.context.moveTo(r.globalX-2,r.globalY),this.context.lineTo(r.globalX+2,r.globalY),this.context.moveTo(r.globalX,r.globalY-2),this.context.lineTo(r.globalX,r.globalY+2),this.context.stroke()};this.game.debugMode==="hover"&&r.touchMouse()&&h(),this.game.debugMode==="forever"&&h()}let l=r.getPhrase();l&&(this.context.font="20px Arial",this.context.fillStyle="black",this.context.fillText(l,40,this.canvas.height-40)),r.getCostume()&&this.drawSprite(r);for(let h of r.drawings)h(this.context,r)}}}this.game.debugCollider&&(this.context.strokeStyle=this.game.debugColor,this.context.beginPath(),this.collisionSystem.draw(this.context),this.context.stroke()),this.context.translate(-this.camera.changes.x,-this.camera.changes.y);let e=this.width/2+this.camera.startCornerX,i=this.height/2+this.camera.startCornerY;this.context.translate(e,i),this.context.scale(this.camera.changes.zoom,this.camera.changes.zoom),this.context.translate(-e,-i),this.camera.changes.reset()}update(){this.tempScheduledCallbacks.length&&(this.scheduledCallbacks=this.scheduledCallbacks.concat(this.tempScheduledCallbacks),this.tempScheduledCallbacks=[]),this.scheduledCallbacks=this.scheduledCallbacks.filter(this.scheduledCallbackExecutor.execute(Date.now(),this.diffTime)),this.sprites.forEach((t,e)=>{for(let i of t){if(i.deleted){this.removeSprite(i,e);return}i.update(this.diffTime)}}),this.diffTime=0}run(){if(this._stopped){this._stopped=!1;for(let t of this.sprites.values())for(let e of t)e.run();this.pendingRun=!0,this.tryDoRun()}}ready(){this.tryDoOnReady(),this.tryDoRun();for(let t of this.sprites.values())for(let e of t)e.ready()}stop(){if(!this._stopped){this._running=!1,this._stopped=!0;for(let t of this.sprites.values())for(let e of t)e.stop();this.stoppedTime=Date.now()}}tryDoOnReady(){if(this.onReadyPending&&this.isReady()){if(this.onReadyPending=!1,this.backgrounds.length&&this.backgroundIndex===null&&this.switchBackground(0),this.onReadyCallbacks.length){for(let t of this.onReadyCallbacks)t();this.onReadyCallbacks=[]}this.game.eventEmitter.emit(R.STAGE_READY_EVENT,{stage:this})}}doOnStart(){for(let t of this.onStartCallbacks)setTimeout(()=>{t()})}tryDoRun(){this.pendingRun&&!this._running&&this.isReady()&&(this._running=!0,this.pendingRun=!1,this.doOnStart(),this.diffTime=Date.now()-this.stoppedTime,setTimeout(()=>{let t=this.stoppedTime,e=()=>{this._stopped||t!==this.stoppedTime||(this.render(),requestAnimationFrame(e))};e()}))}addListeners(){this.eventEmitter.on(R.SPRITE_READY_EVENT,R.SPRITE_READY_EVENT,t=>{this.id==t.detail.stageId&&(this.loadedSprites++,this.tryDoOnReady(),this.tryDoRun())})}};var mt=class{constructor(t,e,i,s){this.trackedKeys=[];this.receiveDataConnections=[];this.userKeydownCallbacks=new Map;this.systemLockedChars={};this.userLockedChars={};this.systemMouseLocked=!1;this.userMouseLocked=!1;this.game=e,this.connection=i,s&&this.defineListeners();let n=i.connect(g.RECEIVE_DATA,(o,a)=>{let l=JSON.parse(o),h=l.char;if(!(!a.SendTime||a.Keydown!="true"||a.MemberId!=t.id||!this.trackedKeys.includes(h))){if(this.userKeydownCallbacks.has(h)){let u=this.userKeydownCallbacks.get(h)[0],d=(m,f=[h],b=!1)=>{b&&(this.userMouseLocked=m);for(let v of f)this.userLockedChars[v.toUpperCase()]=m},_=0,p=()=>{if(this.userLockedChars[h]!==!0||_>999){let m=l.sync;m&&e.syncObjects(m,this.game.calcDeltaTime(a.SendTime)),u(t,d)}else _++,setTimeout(p,50)};p()}this.systemLockedChars[h]=!1}});this.receiveDataConnections.push(n);let r=i.connect(g.RECEIVE_DATA,(o,a)=>{if(!(!a.SendTime||a.Mousedown!="true"||a.MemberId!=t.id)){if(this.userMousedownCallback){let l=this.userMousedownCallback[0],h=JSON.parse(o),u=h.mouseX,d=h.mouseY,_=h.sync,p=(b,v=[],C=!0)=>{C&&(this.userMouseLocked=b);for(let S of v)this.userLockedChars[S.toUpperCase()]=b},m=0,f=()=>{if(this.userMouseLocked!==!0||m>999){_&&e.syncObjects(_,this.game.calcDeltaTime(a.SendTime));let b=new N(u,d);l(b,t,p)}else m++,setTimeout(f,50)};f()}this.systemMouseLocked=!1}});this.receiveDataConnections.push(r)}defineListeners(){this.keydownCallback=t=>{let e=I.getChar(t.keyCode);if(!this.userKeydownCallbacks.has(e)||this.systemLockedChars[e]===!0||this.userLockedChars[e]===!0||!this.trackedKeys.includes(e))return;this.systemLockedChars[e]=!0;let i=this.userKeydownCallbacks.get(e)[1],s=this.userKeydownCallbacks.get(e)[2],n=this.game.packSyncData(i,s);this.connection.sendData(JSON.stringify({char:e,sync:n}),{Keydown:"true"})},this.mousedownCallback=t=>{if(!this.userMousedownCallback||this.systemMouseLocked||this.userMouseLocked)return;let e=this.game.correctMouseX(t.clientX),i=this.game.correctMouseY(t.clientY);if(!this.game.isInsideGame(e,i))return;this.systemMouseLocked=!0;let s=this.userMousedownCallback[1],n=this.userMousedownCallback[2],r=this.game.packSyncData(s,n);this.connection.sendData(JSON.stringify({mouseX:e,mouseY:i,sync:r}),{Mousedown:"true"})},document.addEventListener("keydown",this.keydownCallback),document.addEventListener("mousedown",this.mousedownCallback)}stop(){this.keydownCallback&&document.removeEventListener("keydown",this.keydownCallback);for(let t of this.receiveDataConnections)this.connection.disconnect(g.RECEIVE_DATA,t)}keyDown(t,e,i,s=[]){t=t.toUpperCase(),this.trackedKeys.includes(t)||this.trackedKeys.push(t),this.userKeydownCallbacks.set(t,[e,i,s])}removeKeyDownHandler(t){t=t.toUpperCase(),this.userKeydownCallbacks.delete(t)}mouseDown(t,e,i=[]){this.userMousedownCallback=[t,e,i]}removeMouseDownHandler(){this.userMousedownCallback=null}};var X=class{constructor(t,e){this.parent=t,this.properties=e}getMultiplayerName(){return this.parent.getMultiplayerName()}getSyncId(){return this.parent.getSyncId()}increaseSyncId(){return this.parent.increaseSyncId()}getSyncData(){let t={};for(let e of this.properties)this.parent[e]&&(t[e]=this.parent[e]);return t}setSyncData(t,e,i){this.parent.setSyncData(t,e,i)}onSync(t){throw new Error("Not implemented.")}removeSyncHandler(){throw new Error("Not implemented.")}only(...t){throw new Error("Not implemented.")}};var _t=class{constructor(t,e,i){this.deleted=!1;this.id=t,this._isMe=e,this.game=i,this.multiplayerName="player_"+t,this.syncId=1,this.control=new mt(this,this.game,i.connection,e),this.reservedProps=Object.keys(this),this.reservedProps.push("reservedProps")}keyDown(t,e,i,s=[]){this.control.keyDown(t,e,i,s)}removeKeyDownHandler(t){this.control.removeKeyDownHandler(t)}mouseDown(t,e,i=[]){this.control.mouseDown(t,e,i)}removeMouseDownHandler(){this.control.removeMouseDownHandler()}isMe(){return this._isMe}delete(){if(this.deleted)return;this.control.stop();let t=Object.keys(this);for(let e=0;e<t.length;e++)delete this[t[e]];this.deleted=!0}repeat(t,e,i,s){if(this.deleted){s();return}if(t<1){s();return}let n=e(this);if(n===!1){s();return}if(n>0&&(i=n),t--,t<1){s();return}setTimeout(()=>{requestAnimationFrame(()=>this.repeat(t,e,i,s))},i)}forever(t,e=null){if(this.deleted)return;let i=t(this);i!==!1&&(i>0&&(e=i),e?setTimeout(()=>{requestAnimationFrame(()=>this.forever(t,e))},e):requestAnimationFrame(()=>this.forever(t)))}timeout(t,e){setTimeout(()=>{this.deleted||requestAnimationFrame(()=>t(this))},e)}getMultiplayerName(){return this.multiplayerName}getSyncId(){return this.syncId}increaseSyncId(){return this.syncId++,this.syncId}getSyncData(){let t={};for(let e of Object.keys(this))this.reservedProps.includes(e)||(t[e]=this[e]);return t}setSyncData(t,e,i){let s={};for(let n in e)e.hasOwnProperty(n)&&!this.reservedProps.includes(n)&&(s[n]=this[n],this[n]=e[n]);this.syncCallback&&this.syncCallback(this,t,e,s,i)}onSync(t){this.syncCallback=t}removeSyncHandler(){this.syncCallback=null}only(...t){return new X(this,t)}};var pt=class extends ${constructor(t,e=null,i=1,s=[]){super(e,i,s),this.multiplayerName="sprite_"+t,this.syncId=1,this.reservedProps=Object.keys(this),this.reservedProps.push("body"),this.reservedProps.push("reservedProps")}generateUniqueId(){return Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2)}getCustomerProperties(){let t={};for(let e of Object.keys(this))this.reservedProps.includes(e)||(t[e]=this[e]);return t}getMultiplayerName(){return this.multiplayerName}getSyncId(){return this.syncId}increaseSyncId(){return this.syncId++,this.syncId}getSyncData(){return Object.assign({},this.getCustomerProperties(),{size:this.size,rotateStyle:this.rotateStyle,costumeIndex:this.costumeIndex,deleted:this._deleted,x:this.x,y:this.y,direction:this.direction,hidden:this.hidden,stopped:this.stopped})}setSyncData(t,e,i){let s={};for(let n in e)e.hasOwnProperty(n)&&!this.reservedProps.includes(n)&&(s[n]=this[n],this[n]=e[n]);this.syncCallback&&this.syncCallback(this,t,e,s,i)}onSync(t){this.syncCallback=t}removeSyncHandler(){this.syncCallback=null}only(...t){return new X(this,t)}};var kt=class extends R{constructor(e,i,s,n,r=null,o=!0,a="ru",l=0,h=0,u={}){super(s,n,r,o,a);this.autoSyncGameTimeout=0;this.players=[];this.sharedObjects=[];this.autoSyncGameTimeout=h,this.initializeConnection(e,i,l,u)}send(e,i={},s,n=[]){if(!this.connection)throw new Error("Connection to the server is not established.");let r={data:e,sync:this.packSyncData(s,n)};this.connection.sendData(JSON.stringify(r),i)}sync(e,i=[],s={}){if(!i.length)return;s.SyncGame="true";let n=this.packSyncData(e,i);this.sendData(JSON.stringify(n),s)}syncGame(){let e=this.getSyncObjects(),i=this.packSyncData("game",e);this.sendData(JSON.stringify(i),{SyncGame:"true"})}onConnection(e){this.onConnectionCallback=e}removeConnectionHandler(e){this.onConnectionCallback=null}onReceive(e){this.onReceiveCallback=e}removeReceiveHandler(e){this.onReceiveCallback=null}onMemberJoined(e){this.onMemberJoinedCallback=e}removeMemberJoinedHandler(e){this.onMemberJoinedCallback=null}onMemberLeft(e){this.onMemberLeftCallback=e}removeMemberLeftHandler(e){this.onMemberLeftCallback=null}onGameStarted(e){this.onGameStartedCallback=e}removeGameStartedHandler(e){this.onGameStartedCallback=null}onGameStopped(e){this.onGameStoppedCallback=e}removeGameStoppedHandler(e){this.onGameStoppedCallback=null}onMultiplayerError(e){this.onMultiplayerErrorCallback=e}removeMultiplayerErrorHandler(e){this.onMultiplayerErrorCallback=null}run(){super.run(),this.isHost&&this.autoSyncGameTimeout&&this.autoSyncGame(this.autoSyncGameTimeout)}stop(){super.stop();for(let e of this.players)e.delete();this.players=[]}getPlayers(){return this.players}addSharedObject(e){this.sharedObjects.push(e)}removeSharedObject(e){let i=this.sharedObjects.indexOf(e);i>-1&&this.sharedObjects.splice(i,1)}getSharedObjects(){return this.sharedObjects}getMultiplayerSprites(){return this.getActiveStage()?this.getActiveStage().getSprites().filter(e=>e instanceof pt):[]}getSyncObjects(){let e=this.getMultiplayerSprites(),i=this.getPlayers(),s=this.getSharedObjects();return[...e,...i,...s]}syncObjects(e,i){let s=this.getSyncObjects();for(let[n,r]of Object.entries(e))for(let o of s)if(r[o.getMultiplayerName()]){let a=r[o.getMultiplayerName()];o.setSyncData(n,a,i)}}packSyncData(e,i){let s={};for(let r of i)s[r.getMultiplayerName()]=r.getSyncData(),s[r.getMultiplayerName()].syncId=r.increaseSyncId();let n={};return n[e]=s,n}sendData(e,i={}){if(!this.connection)throw new Error("Connection to the server is not established.");this.connection.sendData(e,i)}calcDeltaTime(e){return Date.now()-e-this.connection.deltaTime}extrapolate(e,i,s){let n=Math.round(i/s*.75);for(let r=0;r<n;r++)e()}async initializeConnection(e,i,s,n={}){let r=new g(e);try{this.connection=await r.connect(i,s,n),this.onConnectionCallback&&this.onConnectionCallback(this.connection),this.connection.connect(g.RECEIVE_DATA,(o,a,l)=>{if(!(!o||!this.running||!a.SendTime)){if(a.SyncGame==="true"){let h=JSON.parse(o);this.syncObjects(h,this.calcDeltaTime(a.SendTime))}else if(a.Keydown!=="true"&&a.Mousedown!=="true"&&this.onReceiveCallback){o=JSON.parse(o);let h=o.userData,u=o.sync;this.syncObjects(u,this.calcDeltaTime(a.SendTime)),this.onReceiveCallback(h,a,l)}}}),this.connection.connect(g.MEMBER_JOINED,(o,a)=>{this.onMemberJoinedCallback&&this.onMemberJoinedCallback(o,a)}),this.connection.connect(g.MEMBER_LEFT,(o,a)=>{this.onMemberLeftCallback&&this.onMemberLeftCallback(o,a)}),this.connection.connect(g.GAME_STARTED,o=>{let a=o.HostId,l=o.Members?.split(",")??[];this.players=l.map(h=>new _t(h,h===this.connection.memberId,this)),this.isHost=a===this.connection.memberId,this.onGameStartedCallback&&this.onGameStartedCallback(this.players,o)}),this.connection.connect(g.GAME_STOPPED,o=>{this.onGameStoppedCallback&&this.onGameStoppedCallback(o)}),this.connection.connect(g.ERROR,o=>{this.onMultiplayerError&&this.onMultiplayerError(o)})}catch(o){console.error(o)}}autoSyncGame(e){setInterval(()=>{this.syncGame()},e)}};var Tt=class{constructor(t){if(this.multiplayerName="data_"+t,this.syncId=1,!O.getInstance().has("game"))throw new Error("You need create Game instance before Sprite instance.");O.getInstance().get("game").addSharedObject(this)}generateUniqueId(){return Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2)}getMultiplayerName(){return this.multiplayerName}getSyncId(){return this.syncId}increaseSyncId(){return this.syncId++,this.syncId}getSyncData(){let t={};for(let e of Object.keys(this))t[e]=this[e];return t}setSyncData(t,e,i){let s={};for(let n in e)e.hasOwnProperty(n)&&(s[n]=this[n],this[n]=e[n]);this.syncCallback&&this.syncCallback(this,t,e,s,i)}onSync(t){this.syncCallback=t}removeSyncHandler(){this.syncCallback=null}only(...t){return new X(this,t)}};0&&(module.exports={BVH,BVHBranch,Camera,CameraChanges,CircleCollider,Collider,CollisionResult,CollisionSystem,Costume,ErrorMessages,EventEmitter,Game,JetcodeSocket,JetcodeSocketConnection,Keyboard,KeyboardMap,Mouse,MultiplayerControl,MultiplayerGame,MultiplayerSprite,OrphanSharedData,Player,PointCollider,PolygonCollider,Registry,SAT,ScheduledCallbackExecutor,ScheduledCallbackItem,ScheduledState,SharedData,Sprite,Stage,Styles,ValidatorFactory,aabbAABB,circleCircle,polygonCircle,polygonPolygon,separatingAxis});
//# sourceMappingURL=scrub.js.map   }
    }
    if (collider) {
      this.updateColliderPosition(collider);
    }
  }
  updateColliderSize(collider) {
    if (collider instanceof PolygonCollider) {
      collider.scale_x = this.size / 100;
      collider.scale_y = this.size / 100;
    } else if (collider instanceof CircleCollider) {
      collider.scale = this.size / 100;
    }
  }
  /**
   * Tags
   */
  addTag(tagName) {
    if (!this.hasTag(tagName)) {
      this._tags.push(tagName);
    }
    for (const child of this._children) {
      child.addTag(tagName);
    }
    return this;
  }
  removeTag(tagName) {
    const foundIndex = this._tags.indexOf(tagName);
    if (foundIndex > -1) {
      this._tags.splice(foundIndex, 1);
    }
    for (const child of this._children) {
      child.addTag(tagName);
    }
    return this;
  }
  hasTag(tagName) {
    return this._tags.includes(tagName);
  }
  get tags() {
    return this._tags;
  }
  /**
   * Costumes
   */
  addCostume(costumePath, options) {
    const costume = new Costume();
    const costumeIndex = this.costumes.length;
    const costumeName = (options?.name ?? "Costume") + "-" + costumeIndex;
    this.costumes.push(costume);
    this.costumeNames.push(costumeName);
    this.pendingCostumes++;
    const image = new Image();
    image.src = costumePath;
    if (options?.alphaColor) {
      image.crossOrigin = "anonymous";
    }
    const onLoadImage = () => {
      if (this.deleted) {
        return;
      }
      const transformedImage = this.transformImage(
        image,
        options?.rotate ?? 0,
        options?.flipX ?? false,
        options?.flipY ?? false,
        options?.x ?? 0,
        options?.y ?? 0,
        options?.width ?? image.naturalWidth,
        options?.height ?? image.naturalHeight,
        options?.alphaColor ?? null,
        options?.alphaTolerance ?? 0,
        options?.crop ?? 0,
        options?.cropTop ?? null,
        options?.cropRight ?? null,
        options?.cropBottom ?? null,
        options?.cropLeft ?? null
      );
      costume.image = transformedImage;
      costume.ready = true;
      this.pendingCostumes--;
      this.tryDoOnReady();
      image.removeEventListener("load", onLoadImage);
    };
    image.addEventListener("load", onLoadImage);
    image.addEventListener("error", () => {
      this.game.throwError(ErrorMessages.COSTUME_NOT_LOADED, { costumePath });
    });
    return this;
  }
  addCostumeGrid(costumePath, options) {
    const image = new Image();
    image.src = costumePath;
    let costumeName = options?.name ?? "Costume";
    this.pendingCostumeGrids++;
    const onLoadImage = () => {
      image.naturalWidth;
      image.naturalHeight;
      let cols = options.cols;
      let rows = options.rows;
      let limit = options.limit;
      let offset = options.offset;
      const chunkWidth = image.naturalWidth / cols;
      const chunkHeight = image.naturalHeight / rows;
      let skip = false;
      let costumeIndex = 0;
      let x = 0;
      let y = 0;
      for (let i = 0; i < rows; i++) {
        for (let t = 0; t < cols; t++) {
          skip = false;
          if (offset !== null) {
            if (offset > 0) {
              offset--;
              skip = true;
            }
          }
          if (!skip) {
            if (limit !== null) {
              if (limit == 0) {
                break;
              }
              if (limit > 0) {
                limit--;
              }
            }
            const costume = new Costume();
            this.costumes.push(costume);
            this.costumeNames.push(costumeName + "-" + costumeIndex);
            const transformedImage = this.transformImage(
              image,
              options?.rotate ?? 0,
              options?.flipX ?? false,
              options?.flipY ?? false,
              x + (options?.x ?? 0),
              y + (options?.y ?? 0),
              options?.width ?? chunkWidth,
              options?.height ?? chunkHeight,
              options?.alphaColor ?? null,
              options?.alphaTolerance ?? 0,
              options?.crop ?? 0,
              options?.cropTop ?? null,
              options?.cropRight ?? null,
              options?.cropBottom ?? null,
              options?.cropLeft ?? null
            );
            costume.image = transformedImage;
            costume.ready = true;
            costumeIndex++;
          }
          x += chunkWidth;
        }
        x = 0;
        y += chunkHeight;
      }
      this.pendingCostumeGrids--;
      this.tryDoOnReady();
      image.removeEventListener("load", onLoadImage);
    };
    image.addEventListener("load", onLoadImage);
    return this;
  }
  drawCostume(callback, options) {
    let image = document.createElement("canvas");
    const context = image.getContext("2d");
    image.width = options?.width ?? 100;
    image.height = options?.height ?? 100;
    this.pendingCostumes++;
    callback(context, this);
    const costumeIndex = this.costumes.length;
    const costumeName = (options?.name ?? "Costume") + "-" + costumeIndex;
    const needTransform = Object.values(options || {}).some((value) => !!value);
    if (needTransform) {
      image = this.transformImage(
        image,
        options?.rotate ?? 0,
        options?.flipX ?? false,
        options?.flipY ?? false,
        options?.x ?? 0,
        options?.y ?? 0,
        options?.width ?? image.width,
        options?.height ?? image.height,
        options?.alphaColor ?? null,
        options?.alphaTolerance ?? 0,
        options?.crop ?? 0,
        options?.cropTop ?? null,
        options?.cropRight ?? null,
        options?.cropBottom ?? null,
        options?.cropLeft ?? null
      );
    }
    const costume = new Costume();
    costume.image = image;
    costume.ready = true;
    this.costumes.push(costume);
    this.costumeNames.push(costumeName + "-" + costumeIndex);
    this.pendingCostumes--;
    return this;
  }
  removeCostume(costumeIndex) {
    if (this.costumes[costumeIndex] === void 0) {
      this.game.throwError(ErrorMessages.COSTUME_INDEX_NOT_FOUND, { costumeIndex });
    }
    this.costumes.splice(costumeIndex, 1);
    this.costumeNames.splice(costumeIndex, 1);
    if (this.costumeIndex === costumeIndex) {
      this.costumeIndex = null;
      if (this.costumes.length > 0) {
        this.nextCostume();
      } else {
        this.costume = null;
      }
    }
    return this;
  }
  switchCostume(costumeIndex) {
    if (this.deleted) {
      return;
    }
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
    }
    const costume = this.costumes[costumeIndex];
    if (costume instanceof Costume && costume.ready) {
      this.costumeIndex = costumeIndex;
      this.costume = costume;
    }
    return this;
  }
  switchCostumeByName(costumeName) {
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
    }
    const costumeIndex = this.costumeNames.indexOf(costumeName);
    if (costumeIndex > -1) {
      this.switchCostume(costumeIndex);
    } else {
      this.game.throwError(ErrorMessages.COSTUME_NAME_NOT_FOUND, { costumeName });
    }
    return this;
  }
  nextCostume(minCostume = 0, maxCostume) {
    if (this.deleted) {
      return;
    }
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
    }
    const maxCostumeIndex = this.costumes.length - 1;
    minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
    maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume ?? maxCostumeIndex));
    let nextCostumeIndex = this.costumeIndex + 1;
    if (nextCostumeIndex > maxCostume || nextCostumeIndex < minCostume) {
      nextCostumeIndex = minCostume;
    }
    if (nextCostumeIndex !== this.costumeIndex) {
      this.switchCostume(nextCostumeIndex);
    }
    return nextCostumeIndex;
  }
  prevCostume(minCostume = 0, maxCostume) {
    if (this.deleted) {
      return;
    }
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
    }
    const maxCostumeIndex = this.costumes.length - 1;
    minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
    maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume ?? maxCostumeIndex));
    let prevCostumeIndex = this.costumeIndex - 1;
    if (prevCostumeIndex < minCostume || prevCostumeIndex > maxCostume) {
      prevCostumeIndex = maxCostume;
    }
    if (prevCostumeIndex !== this.costumeIndex) {
      this.switchCostume(prevCostumeIndex);
    }
    return prevCostumeIndex;
  }
  getCostume() {
    return this.costume;
  }
  getCostumeName() {
    if (this.costumeIndex === null) {
      return "No costume";
    }
    return this.costumeNames[this.costumeIndex];
  }
  getCostumeIndex() {
    return this.costumeIndex;
  }
  transformImage(srcImage, rotate, flipX = false, flipY = false, imageX = 0, imageY = 0, imageWidth = null, imageHeight = null, imageAlphaColor = null, imageAlphaTolerance = 0, crop = 0, cropTop = null, cropRight = null, cropBottom = null, cropLeft = null) {
    cropTop = cropTop ?? crop;
    cropRight = cropRight ?? crop;
    cropBottom = cropBottom ?? crop;
    cropLeft = cropLeft ?? crop;
    imageX += cropRight;
    imageWidth -= cropRight;
    imageWidth -= cropLeft;
    imageY += cropTop;
    imageHeight -= cropTop;
    imageHeight -= cropBottom;
    let imageCanvas = document.createElement("canvas");
    const context = imageCanvas.getContext("2d");
    const radians = rotate * Math.PI / 180;
    let canvasWidth = imageWidth ?? (srcImage instanceof HTMLImageElement ? srcImage.naturalWidth : srcImage.width);
    let canvasHeight = imageHeight ?? (srcImage instanceof HTMLImageElement ? srcImage.naturalHeight : srcImage.height);
    if (rotate) {
      const absCos = Math.abs(Math.cos(radians));
      const absSin = Math.abs(Math.sin(radians));
      canvasWidth = canvasWidth * absCos + canvasHeight * absSin;
      canvasHeight = canvasWidth * absSin + canvasHeight * absCos;
    }
    imageCanvas.width = Math.ceil(canvasWidth);
    imageCanvas.height = Math.ceil(canvasHeight);
    context.translate(imageCanvas.width / 2, imageCanvas.height / 2);
    if (rotate) {
      context.rotate(radians);
    }
    if (flipX || flipY) {
      context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    }
    const offsetX = -imageWidth / 2;
    const offsetY = -imageHeight / 2;
    context.drawImage(
      srcImage,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      offsetX,
      offsetY,
      imageWidth,
      imageHeight
    );
    if (imageAlphaColor) {
      imageCanvas = this.setAlpha(imageCanvas, imageAlphaColor, imageAlphaTolerance ?? 0);
    }
    return imageCanvas;
  }
  setAlpha(image, targetColor, tolerance = 0) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context is not available");
    }
    canvas.width = image.width;
    canvas.height = image.height;
    const imageData = image.getContext("2d").getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
    let targetRGB;
    if (typeof targetColor === "string") {
      targetRGB = this.hexToRgb(targetColor);
      if (!targetRGB) {
        throw new Error(`Invalid HEX color: ${targetColor}`);
      }
    } else {
      targetRGB = targetColor;
    }
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.abs(r - targetRGB.r) <= tolerance && Math.abs(g - targetRGB.g) <= tolerance && Math.abs(b - targetRGB.b) <= tolerance) {
        data[i + 3] = 0;
      }
    }
    context.putImageData(imageData, 0, 0);
    return canvas;
  }
  hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }
    if (hex.length !== 6) {
      return null;
    }
    const bigint = parseInt(hex, 16);
    return {
      r: bigint >> 16 & 255,
      g: bigint >> 8 & 255,
      b: bigint & 255
    };
  }
  cloneCostume(costume, name) {
    this.costumes.push(costume);
    this.costumeNames.push(name);
  }
  /**
   * Sounds
   */
  addSound(soundPath, soundName) {
    if (this.soundNames.includes(soundName)) {
      this.game.throwError(ErrorMessages.SOUND_NAME_ALREADY_EXISTS, { soundName });
    }
    const sound = new Audio();
    sound.src = soundPath;
    this.sounds.push(sound);
    this.soundNames.push(soundName);
    this.pendingSounds++;
    sound.load();
    const onLoadSound = () => {
      this.pendingSounds--;
      this.tryDoOnReady();
      sound.removeEventListener("loadedmetadata", onLoadSound);
    };
    sound.addEventListener("loadedmetadata", onLoadSound);
    return this;
  }
  removeSound(soundName) {
    const soundIndex = this.soundNames.indexOf(soundName);
    if (soundIndex < 0) {
      this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName });
    }
    this.sounds.splice(soundIndex, 1);
    return this;
  }
  playSound(soundName, options = {}) {
    const sound = this.getSound(soundName);
    this.doPlaySound(sound, options);
  }
  startSound(soundName, options = {}) {
    const sound = this.cloneSound(soundName);
    this.doPlaySound(sound, options);
    return sound;
  }
  pauseSound(soundName) {
    const sound = this.getSound(soundName);
    sound.pause();
  }
  getSound(soundName) {
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.SOUND_USE_NOT_READY);
    }
    const soundIndex = this.soundNames.indexOf(soundName);
    if (soundIndex < 0) {
      this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName });
    }
    const sound = this.sounds[soundIndex];
    if (!(sound instanceof Audio)) {
      this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, { soundIndex });
    }
    return sound;
  }
  cloneSound(soundName) {
    const originSound = this.getSound(soundName);
    return new Audio(originSound.src);
  }
  doPlaySound(sound, options = {}) {
    if (options.volume !== void 0) {
      sound.volume = options.volume;
    }
    if (options.currentTime !== void 0) {
      sound.currentTime = options.currentTime;
    }
    if (options.loop !== void 0) {
      sound.loop = options.loop;
    }
    const playPromise = sound.play();
    if (playPromise !== void 0) {
      playPromise.catch((error) => {
        if (error.name === "NotAllowedError") {
          this.game.throwError(ErrorMessages.SOUND_NOT_ALLOWED_ERROR, {}, false);
        } else {
          console.error("Audio playback error:", error);
        }
      });
    }
  }
  /**
   * Visual functionality
   */
  stamp(costumeIndex, withRotation = true) {
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.STAMP_NOT_READY);
    }
    costumeIndex = costumeIndex ?? this.costumeIndex;
    if (!this.costumes[costumeIndex]) {
      this.game.throwError(ErrorMessages.STAMP_COSTUME_NOT_FOUND, { costumeIndex });
    }
    const costume = this.costumes[costumeIndex];
    if (!(costume.image instanceof HTMLCanvasElement)) {
      this.game.throwErrorRaw("The image inside the costume was not found.");
    }
    let direction = 0;
    if (withRotation && this._rotateStyle === "normal") {
      direction = this.direction;
    }
    this.stage.stampImage(costume.image, this.x, this.y, direction);
  }
  pen(callback) {
    this._drawings.push(callback);
  }
  get drawings() {
    return this._drawings;
  }
  set opacity(value) {
    if (value === null) {
      this._opacity = null;
    } else {
      this._opacity = Math.min(1, Math.max(0, value));
    }
  }
  get opacity() {
    return this._opacity;
  }
  set filter(value) {
    this._filter = value;
  }
  get filter() {
    return this._filter;
  }
  set rotateStyle(value) {
    this._rotateStyle = value;
    for (const child of this._children) {
      child.rotateStyle = value;
    }
  }
  get rotateStyle() {
    return this._rotateStyle;
  }
  set layer(newLayer) {
    this.stage.changeSpriteLayer(this, this._layer, newLayer);
    this._layer = newLayer;
    for (const child of this._children) {
      child.layer = child.layer + this._layer;
    }
  }
  get layer() {
    return this._layer;
  }
  set hidden(value) {
    this._hidden = value;
    for (const child of this._children) {
      child.hidden = value;
    }
  }
  get hidden() {
    return this._hidden;
  }
  say(text, time) {
    this.phrase = this.name + ": " + text;
    this.phraseLiveTime = null;
    if (time) {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      this.phraseLiveTime = currentTime + time;
    }
  }
  getPhrase() {
    if (this.phrase) {
      if (this.phraseLiveTime === null) {
        return this.phrase;
      }
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (this.phraseLiveTime > currentTime) {
        return this.phrase;
      } else {
        this.phrase = null;
        this.phraseLiveTime = null;
      }
    }
    return null;
  }
  /**
   * Movements functionality.
   */
  move(steps) {
    const angleRadians = this.globalAngleRadians;
    this.x += steps * Math.sin(angleRadians);
    this.y -= steps * Math.cos(angleRadians);
  }
  pointForward(object) {
    let globalX = object.globalX ? object.globalX : object.x;
    let globalY = object.globalY ? object.globalY : object.y;
    this.globalDirection = Math.atan2(this.globalY - globalY, this.globalX - globalX) / Math.PI * 180 - 90;
  }
  getDistanceTo(object) {
    let globalX = object.globalX ? object.globalX : object.x;
    let globalY = object.globalY ? object.globalY : object.y;
    return Math.sqrt(Math.abs(this.globalX - globalX) + Math.abs(this.globalY - globalY));
  }
  bounceOnEdge() {
    if (this.touchTopEdge() || this.touchBottomEdge()) {
      this.direction = 180 - this.direction;
    }
    if (this.touchLeftEdge() || this.touchRightEdge()) {
      this.direction *= -1;
    }
  }
  /**
   * Coordinates, dimensions, rotations, pivots, etc.
   */
  set x(value) {
    this._x = value;
    if (this._children.length) {
      this.updateCenterParams();
    }
    const collider = this.collider;
    if (collider) {
      this.updateColliderPosition(collider);
    }
    for (const child of this._children) {
      if (child.collider) {
        child.updateColliderPosition(child.collider);
      }
    }
  }
  get x() {
    return this._x;
  }
  set y(value) {
    this._y = value;
    if (this._children.length) {
      this.updateCenterParams();
    }
    const collider = this.collider;
    if (collider) {
      this.updateColliderPosition(collider);
    }
    for (const child of this._children) {
      if (child.collider) {
        child.updateColliderPosition(child.collider);
      }
    }
  }
  get y() {
    return this._y;
  }
  get globalX() {
    if (this._parentSprite) {
      if (this._rotateStyle === "leftRight" || this._rotateStyle === "none") {
        return this._parentSprite.imageCenterX + this._x * this.size / 100;
      }
      return this._parentSprite.imageCenterX + this.distanceToParent * Math.cos(this.angleToParent - this._parentSprite.globalAngleRadians) * this.size / 100;
    }
    return this._x;
  }
  get globalY() {
    if (this._parentSprite) {
      if (this._rotateStyle === "leftRight" || this._rotateStyle === "none") {
        return this._parentSprite.imageCenterY + this._y;
      }
      return this._parentSprite.imageCenterY - this.distanceToParent * Math.sin(this.angleToParent - this._parentSprite.globalAngleRadians) * this.size / 100;
    }
    return this._y;
  }
  get imageCenterX() {
    if (this._rotateStyle === "leftRight" || this._rotateStyle === "none") {
      const leftRightMultiplier = this._direction > 180 && this._rotateStyle === "leftRight" ? -1 : 1;
      return this.globalX - this._pivotOffsetX * leftRightMultiplier * this.size / 100;
    }
    return this.globalX + Math.cos(this._centerAngle - this.globalAngleRadians) * this._centerDistance * this.size / 100;
  }
  get imageCenterY() {
    if (this._rotateStyle === "leftRight" || this._rotateStyle === "none") {
      return this.globalY - this._pivotOffsetY * this.size / 100;
    }
    return this.globalY - Math.sin(this._centerAngle - this.globalAngleRadians) * this._centerDistance * this.size / 100;
  }
  get realX() {
    return this.x - this.width / 2;
  }
  get realY() {
    return this.y - this.height / 2;
  }
  get rightX() {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_x * this.size / 100 : 0;
    return this.imageCenterX + this.width / 2 + offset;
  }
  set rightX(x) {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_x * this.size / 100 : 0;
    this.x = x - this.width / 2 - offset;
  }
  get leftX() {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_x * this.size / 100 : 0;
    return this.imageCenterX - this.width / 2 + offset;
  }
  set leftX(x) {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_x * this.size / 100 : 0;
    this.x = x + this.width / 2 + offset;
  }
  get topY() {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_y * this.size / 100 : 0;
    return this.imageCenterY - this.height / 2 + offset;
  }
  set topY(y) {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_y * this.size / 100 : 0;
    this.y = y + this.height / 2 + offset;
  }
  get bottomY() {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_y * this.size / 100 : 0;
    return this.imageCenterY + this.height / 2 + offset;
  }
  set bottomY(y) {
    const collider = this.collider;
    const offset = collider ? collider.center_offset_y * this.size / 100 : 0;
    this.y = y - this.height / 2 - offset;
  }
  get width() {
    if (this.collider instanceof PolygonCollider) {
      const angleRadians = this.globalAngleRadians;
      return Math.abs(this.sourceWidth * Math.cos(angleRadians)) + Math.abs(this.sourceHeight * Math.sin(angleRadians));
    }
    return this.sourceWidth;
  }
  get height() {
    if (this.collider instanceof PolygonCollider) {
      const angleRadians = this.globalAngleRadians;
      return Math.abs(this.sourceWidth * Math.sin(angleRadians)) + Math.abs(this.sourceHeight * Math.cos(angleRadians));
    }
    return this.sourceHeight;
  }
  get sourceWidth() {
    return this._width * this.size / 100;
  }
  get sourceHeight() {
    return this._height * this.size / 100;
  }
  set size(value) {
    this._size = value;
    const collider = this.collider;
    if (collider) {
      this.updateColliderSize(collider);
    }
    for (const child of this._children) {
      child.size = value;
    }
  }
  get size() {
    return this._size;
  }
  set direction(direction) {
    if (direction * 0 !== 0) {
      return;
    }
    direction = direction % 360;
    if (direction < 0) {
      direction += 360;
    }
    this._direction = direction > 360 ? direction - 360 : direction;
    this.updateColliderAngle();
    for (const child of this._children) {
      child.updateColliderAngle();
    }
  }
  get direction() {
    return this._direction;
  }
  set globalDirection(value) {
    this.direction = this._parentSprite ? value - this._parentSprite.direction : value;
  }
  get globalDirection() {
    return this._parentSprite ? this._parentSprite.direction + this.direction : this.direction;
  }
  get globalAngleRadians() {
    return this.globalDirection * Math.PI / 180;
  }
  get angleToParent() {
    return -Math.atan2(this.y, this.x);
  }
  get distanceToParent() {
    return Math.hypot(this.x, this.y);
  }
  setPivotOffset(x = 0, y = 0) {
    this.pivotOffsetX = x;
    this.pivotOffsetY = y;
    return this;
  }
  set pivotOffsetX(value) {
    const prevX = this.x;
    this._pivotOffsetX = value;
    this.updateCenterParams();
    this.x = prevX;
  }
  get pivotOffsetX() {
    return this._pivotOffsetX;
  }
  set pivotOffsetY(value) {
    const prevY = this.y;
    this._pivotOffsetY = value;
    this.updateCenterParams();
    this.y = prevY;
  }
  get pivotOffsetY() {
    return this._pivotOffsetY;
  }
  updateCenterParams() {
    this._centerDistance = Math.hypot(this._pivotOffsetX, this._pivotOffsetY);
    this._centerAngle = -Math.atan2(-this._pivotOffsetY, -this._pivotOffsetX);
  }
  /**
   * Touches
   */
  touchSprite(sprite, checkChildren = true) {
    this._collidedSprite = null;
    if (sprite.hidden || this.hidden || sprite.stopped || this.stopped || sprite.deleted || this.deleted) {
      return false;
    }
    const collider = this.collider;
    const otherCollider = sprite.collider;
    let isTouch = collider && otherCollider && collider.collides(otherCollider, this.collisionResult);
    if (isTouch) {
      return true;
    }
    if (collider) {
      for (const otherChild of sprite.getChildren()) {
        if (this.touchSprite(otherChild, false)) {
          return true;
        }
      }
    }
    if (!checkChildren) {
      return false;
    }
    for (const child of this._children) {
      if (otherCollider && child.touchSprite(sprite)) {
        this._collidedSprite = child;
        return true;
      }
      for (const otherChild of sprite.getChildren()) {
        if (child.touchSprite(otherChild)) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchSprites(sprites, checkChildren = true) {
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    for (const sprite of sprites) {
      if (this.touchSprite(sprite, checkChildren)) {
        return true;
      }
    }
    return false;
  }
  touchMouse(checkChildren = true) {
    return this.touchPoint(this.game.getMousePoint(), checkChildren);
  }
  touchPoint(point, checkChildren = true) {
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    const collider = this.collider;
    const isTouch = collider && collider.collides(point, this.collisionResult);
    if (isTouch) {
      return true;
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchPoint(child.game.getMousePoint())) {
          this._collidedSprite = child.otherSprite;
          return true;
        }
      }
    }
    return false;
  }
  touchEdge(checkChildren = true) {
    const result = this.getPureCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    if (this.collider) {
      const gameWidth = this.game.width;
      const gameHeight = this.game.height;
      if (this.topY < 0) {
        result.collision = true;
        result.overlap = -this.topY;
        result.overlap_y = -1;
        return true;
      }
      if (this.bottomY > gameHeight) {
        result.collision = true;
        result.overlap = this.bottomY - gameHeight;
        result.overlap_y = 1;
        return true;
      }
      if (this.leftX < 0) {
        result.collision = true;
        result.overlap = -this.leftX;
        result.overlap_x = -1;
        return true;
      }
      if (this.rightX > gameWidth) {
        result.collision = true;
        result.overlap = this.rightX - gameWidth;
        result.overlap_x = 1;
        return true;
      }
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchEdge()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchTopEdge(checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    if (this.collider && this.topY < 0) {
      this.collisionResult.collision = true;
      this.collisionResult.overlap = -this.topY;
      this.collisionResult.overlap_y = -1;
      return true;
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchTopEdge()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchBottomEdge(checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    if (this.collider && this.bottomY > this.game.height) {
      this.collisionResult.collision = true;
      this.collisionResult.overlap = this.bottomY - this.game.height;
      this.collisionResult.overlap_y = 1;
      return true;
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchBottomEdge()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchLeftEdge(checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    if (this.collider && this.leftX < 0) {
      this.collisionResult.collision = true;
      this.collisionResult.overlap = -this.leftX;
      this.collisionResult.overlap_x = -1;
      return true;
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchLeftEdge()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchRightEdge(checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    if (this.collider && this.rightX > this.game.width) {
      this.collisionResult.collision = true;
      this.collisionResult.overlap = this.rightX - this.game.width;
      this.collisionResult.overlap_x = 1;
      return true;
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchRightEdge()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchTag(tagName, checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    const collider = this.collider;
    if (collider) {
      const potentialsColliders = collider.potentials();
      if (!potentialsColliders.length) {
        return false;
      }
      for (const potentialCollider of potentialsColliders) {
        const potentialSprite = potentialCollider.parentSprite;
        if (potentialSprite && potentialSprite.hasTag(tagName)) {
          if (!potentialSprite.hidden && !potentialSprite.stopped && !potentialSprite.deleted && collider.collides(potentialCollider, this.collisionResult)) {
            return true;
          }
        }
      }
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchTag(tagName)) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  touchTagAll(tagName, checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    const collidedSprites = [];
    const collider = this.collider;
    if (collider) {
      const potentialsColliders = collider.potentials();
      if (!potentialsColliders.length) {
        return false;
      }
      for (const potentialCollider of potentialsColliders) {
        const potentialSprite = potentialCollider.parentSprite;
        if (potentialSprite && potentialSprite.hasTag(tagName)) {
          if (!potentialSprite.hidden && !potentialSprite.stopped && !potentialSprite.deleted && potentialSprite.collider && collider.collides(potentialCollider, this.collisionResult)) {
            collidedSprites.push(potentialSprite);
          }
        }
      }
    }
    if (checkChildren) {
      for (const child of this._children) {
        const collision = child.touchTagAll(tagName);
        if (collision && !collision.length) {
          for (const sprite of collision) {
            collidedSprites.push(sprite);
          }
        }
      }
    }
    if (collidedSprites.length) {
      return collidedSprites;
    }
    return false;
  }
  touchAnySprite(checkChildren = true) {
    this.clearCollisionResult();
    this._collidedSprite = null;
    if (this.hidden || this.stopped || this.deleted) {
      return false;
    }
    const collider = this.collider;
    if (collider) {
      const potentialsColliders = collider.potentials();
      if (!potentialsColliders.length) {
        return false;
      }
      for (const potentialCollider of potentialsColliders) {
        const potentialSprite = potentialCollider.parentSprite;
        if (!potentialSprite.hidden && !potentialSprite.stopped && !potentialSprite.deleted && collider.collides(potentialCollider, this.collisionResult)) {
          return true;
        }
      }
    }
    if (checkChildren) {
      for (const child of this._children) {
        if (child.touchAnySprite()) {
          this._collidedSprite = child;
          return true;
        }
      }
    }
    return false;
  }
  get overlap() {
    if (this._collidedSprite) {
      return this._collidedSprite.overlap;
    }
    if (!this.collisionResult.collision) {
      return 0;
    }
    return this.collisionResult.overlap;
  }
  get overlapX() {
    if (this._collidedSprite) {
      return this._collidedSprite.overlapX;
    }
    if (!this.collisionResult.collision) {
      return 0;
    }
    return this.collisionResult.overlap_x * this.collisionResult.overlap;
  }
  get overlapY() {
    if (this._collidedSprite) {
      return this._collidedSprite.overlapY;
    }
    if (!this.collisionResult.collision) {
      return 0;
    }
    return this.collisionResult.overlap_y * this.collisionResult.overlap;
  }
  get otherSprite() {
    if (!this.collisionResult.collision) {
      return null;
    }
    return this.collisionResult.b.parentSprite;
  }
  get otherMainSprite() {
    if (!this.collisionResult.collision) {
      return null;
    }
    return this.collisionResult.b.parentSprite.getMainSprite();
  }
  clearCollisionResult() {
    this.collisionResult.collision = false;
    this.collisionResult.a = null;
    this.collisionResult.b = null;
    this.collisionResult.a_in_b = false;
    this.collisionResult.b_in_a = false;
    this.collisionResult.overlap = 0;
    this.collisionResult.overlap_x = 0;
    this.collisionResult.overlap_y = 0;
  }
  getPureCollisionResult() {
    this.clearCollisionResult();
    return this.collisionResult;
  }
  /**
   * Schedulers
   */
  timeout(callback, timeout) {
    this.repeat(callback, 1, null, timeout, void 0);
  }
  repeat(callback, repeat, interval, timeout, finishCallback) {
    const state = new ScheduledState(interval, repeat, 0);
    if (timeout) {
      timeout = Date.now() + timeout;
    }
    this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
    return state;
  }
  forever(callback, interval, timeout, finishCallback) {
    const state = new ScheduledState(interval);
    if (timeout) {
      timeout = Date.now() + timeout;
    }
    this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
    return state;
  }
  update(diffTime) {
    if (this.deleted) {
      return;
    }
    if (this.tempScheduledCallbacks.length) {
      this.scheduledCallbacks = this.scheduledCallbacks.concat(this.tempScheduledCallbacks);
      this.tempScheduledCallbacks = [];
    }
    this.scheduledCallbacks = this.scheduledCallbacks.filter(
      this.scheduledCallbackExecutor.execute(Date.now(), diffTime)
    );
  }
  /**
   * Start and stop, create and delete
   */
  run() {
    this._stopped = false;
  }
  stop() {
    this._stopped = true;
  }
  ready() {
    this.tryDoOnReady();
  }
  get original() {
    return this._original;
  }
  setOriginal(original) {
    this._original = original;
  }
  createClone(stage) {
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.CLONED_NOT_READY);
    }
    if (!stage) {
      stage = this.stage;
    }
    const clone = new _Sprite(stage, this.layer);
    clone.setOriginal(this);
    clone.name = this.name;
    clone._rotateStyle = this._rotateStyle;
    clone.x = this.x;
    clone.y = this.y;
    clone.pivotOffsetX = this.pivotOffsetX;
    clone.pivotOffsetY = this.pivotOffsetY;
    clone.direction = this.direction;
    clone.size = this.size;
    clone.hidden = this.hidden;
    clone._deleted = this.deleted;
    clone._stopped = this.stopped;
    clone._tags.push(...this.tags);
    clone.defaultColliderNone = this.defaultColliderNone;
    for (let i = 0; i < this.costumes.length; i++) {
      clone.cloneCostume(this.costumes[i], this.costumeNames[i]);
    }
    clone.switchCostume(this.costumeIndex);
    for (let [soundIndex, sound] of this.sounds.entries()) {
      clone.sounds.push(sound);
      clone.soundNames.push(this.soundNames[soundIndex]);
    }
    clone.currentColliderName = null;
    clone.cloneCollider(this);
    if (this.currentColliderName) {
      clone.switchCollider(this.currentColliderName);
    }
    for (const child of this._children) {
      const childClone = child.createClone();
      clone.addChild(childClone);
      childClone.x = child.x;
      childClone.y = child.y;
      childClone.direction = child.direction;
    }
    clone.ready();
    return clone;
  }
  delete() {
    if (this.deleted) {
      return;
    }
    this.stage.removeSprite(this, this.layer);
    this.eventEmitter.clearAll();
    this.removeCollider();
    this.scheduledCallbackExecutor = null;
    for (const child of this._children) {
      child.delete();
    }
    let props = Object.keys(this);
    for (let i = 0; i < props.length; i++) {
      delete this[props[i]];
    }
    this.costumes = [];
    this.costumeNames = [];
    this.sounds = [];
    this.soundNames = [];
    this.onReadyCallbacks = [];
    this.tempScheduledCallbacks = [];
    this.scheduledCallbacks = [];
    this._children = [];
    this._deleted = true;
  }
  deleteClones() {
    const spritesToDelete = this.stage.getSprites().filter((sprite) => sprite.original === this);
    spritesToDelete.forEach((sprite) => sprite.delete());
  }
  tryDoOnReady() {
    if (this.onReadyPending && this.isReady()) {
      this.onReadyPending = false;
      if (this.costumes.length && this.costume === null) {
        this.switchCostume(0);
      }
      if (!this.defaultColliderNone && this.colliders.size === 0 && this.costumes.length) {
        const colliderName = "main";
        this.setCostumeCollider(colliderName, 0);
        this.switchCollider(colliderName);
        this.updateColliderPosition(this.collider);
        this.updateColliderSize(this.collider);
      }
      if (!this.collider && this.colliders.size) {
        const colliderName = this.colliders.keys().next().value;
        this.switchCollider(colliderName);
        this.updateColliderPosition(this.collider);
        this.updateColliderSize(this.collider);
      }
      if (this.onReadyCallbacks.length) {
        for (const callback of this.onReadyCallbacks) {
          callback();
        }
        this.onReadyCallbacks = [];
      }
      this.stage.eventEmitter.emit(Game.SPRITE_READY_EVENT, {
        sprite: this,
        stageId: this.stage.id
      });
    }
  }
};

// src/ScheduledCallbackExecutor.ts
var ScheduledCallbackExecutor = class {
  constructor(context) {
    this.context = context;
  }
  execute(now, diffTime) {
    return (item) => {
      const state = item.state;
      if (this.context instanceof Sprite) {
        if (this.context.deleted) {
          return false;
        }
        if (this.context.stopped) {
          return true;
        }
      }
      if (item.timeout && diffTime) {
        item.timeout += diffTime;
      }
      if (!item.timeout || item.timeout <= now) {
        const result = item.callback.bind(this.context)(this.context, state);
        if (state.maxIterations) {
          state.currentIteration++;
        }
        const isFinished = result === false || item.timeout && !state.interval && !state.maxIterations || state.maxIterations && state.currentIteration >= state.maxIterations;
        if (isFinished) {
          if (item.finishCallback) {
            item.finishCallback(this.context, state);
          }
          return false;
        }
        if (state.interval) {
          item.timeout = now + state.interval;
        }
      }
      return true;
    };
  }
};

// src/CameraChanges.ts
var CameraChanges = class {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.direction = 0;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.direction = 0;
  }
};

// src/Camera.ts
var Camera = class {
  constructor(stage) {
    this._direction = 0;
    this._zoom = 1;
    this.stage = stage;
    this._x = this.stage.width / 2;
    this._y = this.stage.height / 2;
    this.updateRenderRadius();
    this.changes = new CameraChanges();
  }
  set direction(value) {
    let direction = value % 360;
    direction = direction < 0 ? direction + 360 : direction;
    this.changes.direction = direction - this._direction;
    this._direction = direction;
  }
  get direction() {
    return this._direction;
  }
  get angleDirection() {
    return this._direction * Math.PI / 180;
  }
  get width() {
    return this.stage.width / this._zoom;
  }
  get height() {
    return this.stage.height / this._zoom;
  }
  set x(value) {
    this.changes.x = value - this._x;
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set y(value) {
    this.changes.y = value - this._y;
    this._y = value;
  }
  get y() {
    return this._y;
  }
  get startCornerX() {
    return this._x - this.stage.width / 2;
  }
  get startCornerY() {
    return this._y - this.stage.height / 2;
  }
  get renderRadius() {
    return this._renderRadius;
  }
  set zoom(value) {
    if (this.changes.zoom == 1) {
      const newZoom = value < 0.1 ? 0.1 : value;
      this.changes.zoom = newZoom / this._zoom;
      this._zoom = newZoom;
      this.updateRenderRadius();
    }
  }
  get zoom() {
    return this._zoom;
  }
  updateRenderRadius() {
    this._renderRadius = Math.hypot(this.width, this.height) / 1.7;
  }
};

// src/Stage.ts
var Stage = class {
  constructor(background = null) {
    this.background = null;
    this.backgroundIndex = null;
    this.backgrounds = [];
    this.sprites = /* @__PURE__ */ new Map();
    this.drawings = /* @__PURE__ */ new Map();
    this.sounds = [];
    this.soundNames = [];
    this.addedSprites = 0;
    this.loadedSprites = 0;
    this.pendingBackgrounds = 0;
    this.pendingSounds = 0;
    this.pendingRun = false;
    this.onReadyPending = true;
    this.onReadyCallbacks = [];
    this.onStartCallbacks = [];
    this.scheduledCallbacks = [];
    this.tempScheduledCallbacks = [];
    this._stopped = true;
    this._running = false;
    this.stoppedTime = null;
    this.diffTime = null;
    if (!Registry.getInstance().has("game")) {
      throw new Error("You need create Game instance before Stage instance.");
    }
    this.game = Registry.getInstance().get("game");
    let stage = this;
    if (this.game.displayErrors) {
      stage = this.game.validatorFactory.createValidator(this, "Stage");
    }
    stage.id = Symbol();
    stage.eventEmitter = new EventEmitter();
    stage.collisionSystem = new CollisionSystem();
    stage.canvas = stage.game.canvas;
    stage.context = stage.game.context;
    if (background) {
      stage.addBackground(background);
    }
    stage.addListeners();
    stage.game.addStage(stage);
    stage.scheduledCallbackExecutor = new ScheduledCallbackExecutor(stage);
    stage.stoppedTime = Date.now();
    stage.init();
    stage.camera = new Camera(stage);
    return stage;
  }
  init() {
  }
  /**
   * Events
   */
  onStart(onStartCallback) {
    this.onStartCallbacks.push(onStartCallback);
  }
  onReady(callback) {
    this.onReadyCallbacks.push(callback);
  }
  /**
   * States
   */
  get running() {
    return this._running;
  }
  get stopped() {
    return this._stopped;
  }
  isReady() {
    return this.addedSprites == this.loadedSprites && this.pendingBackgrounds === 0;
  }
  /**
   * Dimensions
   */
  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  /**
   * Backgrounds
   */
  set backgroundColor(color) {
    this.drawBackground((context, stage) => {
      context.fillStyle = color;
      context.fillRect(0, 0, stage.width, stage.height);
    });
  }
  drawBackground(callback) {
    const backgroundCanvas = document.createElement("canvas");
    const context = backgroundCanvas.getContext("2d");
    backgroundCanvas.width = this.width;
    backgroundCanvas.height = this.height;
    this.pendingBackgrounds++;
    callback(context, this);
    this.backgrounds.push(backgroundCanvas);
    this.pendingBackgrounds--;
    return this;
  }
  addBackground(backgroundPath) {
    const backgroundImage = new Image();
    backgroundImage.src = backgroundPath;
    this.pendingBackgrounds++;
    const onLoad = () => {
      const backgroundCanvas = document.createElement("canvas");
      const context = backgroundCanvas.getContext("2d");
      backgroundCanvas.width = this.width;
      backgroundCanvas.height = this.height;
      context.drawImage(
        backgroundImage,
        0,
        0,
        this.width,
        this.height
      );
      this.backgrounds.push(backgroundCanvas);
      this.pendingBackgrounds--;
      this.tryDoOnReady();
      this.tryDoRun();
      backgroundImage.removeEventListener("load", onLoad);
    };
    backgroundImage.addEventListener("load", onLoad);
    backgroundImage.addEventListener("error", () => {
      this.game.throwError(ErrorMessages.BACKGROUND_NOT_LOADED, { backgroundPath });
    });
    return this;
  }
  switchBackground(backgroundIndex) {
    this.backgroundIndex = backgroundIndex;
    const background = this.backgrounds[backgroundIndex];
    if (background) {
      this.background = background;
    }
  }
  nextBackground() {
    let nextBackgroundIndex = this.backgroundIndex + 1;
    if (nextBackgroundIndex > this.backgrounds.length - 1) {
      nextBackgroundIndex = 0;
    }
    if (nextBackgroundIndex !== this.backgroundIndex) {
      this.switchBackground(nextBackgroundIndex);
    }
  }
  /**
   * Sounds
   */
  addSound(soundPath, soundName) {
    if (this.soundNames.includes(soundName)) {
      this.game.throwError(ErrorMessages.SOUND_NAME_ALREADY_EXISTS, { soundName });
    }
    const sound = new Audio();
    sound.src = soundPath;
    this.sounds.push(sound);
    this.soundNames.push(soundName);
    this.pendingSounds++;
    sound.load();
    const onLoadSound = () => {
      this.pendingSounds--;
      this.tryDoOnReady();
      sound.removeEventListener("loadedmetadata", onLoadSound);
    };
    sound.addEventListener("loadedmetadata", onLoadSound);
    return this;
  }
  removeSound(soundName) {
    const soundIndex = this.soundNames.indexOf(soundName);
    if (soundIndex < 0) {
      this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName });
    }
    this.sounds.splice(soundIndex, 1);
    return this;
  }
  playSound(soundName, options = {}) {
    const sound = this.getSound(soundName);
    this.doPlaySound(sound, options);
  }
  startSound(soundName, options = {}) {
    const sound = this.cloneSound(soundName);
    this.doPlaySound(sound, options);
    return sound;
  }
  pauseSound(soundName) {
    const sound = this.getSound(soundName);
    sound.pause();
  }
  getSound(soundName) {
    if (!this.isReady()) {
      this.game.throwError(ErrorMessages.SOUND_USE_NOT_READY);
    }
    const soundIndex = this.soundNames.indexOf(soundName);
    if (soundIndex < 0) {
      this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName });
    }
    const sound = this.sounds[soundIndex];
    if (!(sound instanceof Audio)) {
      this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, { soundIndex });
    }
    return sound;
  }
  cloneSound(soundName) {
    const originSound = this.getSound(soundName);
    return new Audio(originSound.src);
  }
  doPlaySound(sound, options = {}) {
    if (options.volume !== void 0) {
      sound.volume = options.volume;
    }
    if (options.currentTime !== void 0) {
      sound.currentTime = options.currentTime;
    }
    if (options.loop !== void 0) {
      sound.loop = options.loop;
    }
    const playPromise = sound.play();
    if (playPromise !== void 0) {
      playPromise.catch((error) => {
        if (error.name === "NotAllowedError") {
          this.game.throwError(ErrorMessages.SOUND_NOT_ALLOWED_ERROR, {}, false);
        } else {
          console.error("Audio playback error:", error);
        }
      });
    }
  }
  /**
   * Sprite management
   */
  addSprite(sprite) {
    let layerSprites;
    if (this.sprites.has(sprite.layer)) {
      layerSprites = this.sprites.get(sprite.layer);
    } else {
      layerSprites = [];
      this.sprites.set(sprite.layer, layerSprites);
    }
    layerSprites.push(sprite);
    this.addedSprites++;
    return this;
  }
  removeSprite(sprite, layer) {
    if (!this.sprites.has(layer)) {
      this.game.throwErrorRaw('The layer "' + layer + '" not defined in the stage.');
    }
    const layerSprites = this.sprites.get(layer);
    layerSprites.splice(layerSprites.indexOf(sprite), 1);
    if (!layerSprites.length) {
      this.sprites.delete(layer);
    }
    if (sprite.deleted || sprite.isReady()) {
      this.loadedSprites--;
    }
    this.addedSprites--;
    return this;
  }
  getSprites() {
    return Array.from(this.sprites.values()).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
  }
  changeSpriteLayer(sprite, fromLayer, toLayer) {
    if (!this.sprites.has(fromLayer)) {
      this.game.throwErrorRaw('The layer "' + fromLayer + '" not defined in the stage.');
    }
    const fromLayerSprites = this.sprites.get(fromLayer);
    fromLayerSprites.splice(fromLayerSprites.indexOf(sprite), 1);
    if (!fromLayerSprites.length) {
      this.sprites.delete(fromLayer);
    }
    let toLayerSprites = [];
    if (this.sprites.has(toLayer)) {
      toLayerSprites = this.sprites.get(toLayer);
    } else {
      this.sprites.set(toLayer, toLayerSprites);
    }
    toLayerSprites.push(sprite);
  }
  /**
   * Draw
   */
  drawSprite(sprite) {
    const costume = sprite.getCostume();
    const image = costume.image;
    const dstX = sprite.imageCenterX - sprite.sourceWidth / 2;
    const dstY = sprite.imageCenterY - sprite.sourceHeight / 2;
    const dstWidth = sprite.sourceWidth;
    const dstHeight = sprite.sourceHeight;
    const direction = sprite.globalDirection;
    const rotateStyle = sprite.rotateStyle;
    let colliderOffsetX = (sprite.sourceWidth - costume.width * sprite.size / 100) / 2;
    let colliderOffsetY = (sprite.sourceHeight - costume.height * sprite.size / 100) / 2;
    const needSave = rotateStyle === "normal" && direction !== 0 || rotateStyle === "leftRight" && direction > 180 || sprite.opacity !== null || sprite.filter !== null && sprite.filter != "";
    if (needSave) {
      this.context.save();
    }
    if (sprite.opacity !== null) {
      this.context.globalAlpha = sprite.opacity;
    }
    if (sprite.filter) {
      this.context.filter = sprite.filter;
    }
    if (rotateStyle === "normal" && direction !== 0) {
      this.context.translate(dstX + dstWidth / 2, dstY + dstHeight / 2);
      this.context.rotate(sprite.globalAngleRadians);
      this.context.translate(-dstX - dstWidth / 2, -dstY - dstHeight / 2);
    }
    if (rotateStyle === "leftRight" && direction > 180) {
      this.context.scale(-1, 1);
      this.context.drawImage(
        image,
        0,
        0,
        costume.width,
        costume.height,
        -dstX - dstWidth + colliderOffsetX,
        dstY + colliderOffsetY,
        costume.width * sprite.size / 100,
        costume.height * sprite.size / 100
      );
    } else {
      this.context.drawImage(
        image,
        0,
        0,
        costume.width,
        costume.height,
        dstX + colliderOffsetX,
        dstY + colliderOffsetY,
        costume.width * sprite.size / 100,
        costume.height * sprite.size / 100
      );
    }
    if (needSave) {
      this.context.restore();
    }
  }
  stampImage(stampImage, x, y, direction = 0) {
    if (this.background instanceof HTMLCanvasElement) {
      const backgroundCanvas = document.createElement("canvas");
      const context = backgroundCanvas.getContext("2d");
      backgroundCanvas.width = this.width;
      backgroundCanvas.height = this.height;
      context.drawImage(
        this.background,
        0,
        0,
        this.width,
        this.height
      );
      const stampWidth = stampImage instanceof HTMLImageElement ? stampImage.naturalWidth : stampImage.width;
      const stampHeight = stampImage instanceof HTMLImageElement ? stampImage.naturalHeight : stampImage.height;
      const stampDstX = x - stampWidth / 2;
      const stampDstY = y - stampHeight / 2;
      if (direction !== 0) {
        const angleRadians = direction * Math.PI / 180;
        context.translate(stampDstX + stampWidth / 2, stampDstY + stampHeight / 2);
        context.rotate(angleRadians);
        context.translate(-stampDstX - stampWidth / 2, -stampDstY - stampHeight / 2);
      }
      context.drawImage(
        stampImage,
        stampDstX,
        stampDstY,
        stampWidth,
        stampHeight
      );
      this.background = backgroundCanvas;
      this.backgrounds[this.backgroundIndex] = this.background;
    }
  }
  pen(callback, layer = 0) {
    let layerDrawings;
    if (this.drawings.has(layer)) {
      layerDrawings = this.drawings.get(layer);
    } else {
      layerDrawings = [];
      this.drawings.set(layer, layerDrawings);
    }
    layerDrawings.push(callback);
  }
  /**
   * Schedulers and render
   */
  timeout(callback, timeout) {
    this.repeat(callback, 1, null, timeout, void 0);
  }
  repeat(callback, repeat, interval = null, timeout = null, finishCallback) {
    const state = new ScheduledState(interval, repeat, 0);
    if (timeout) {
      timeout = Date.now() + timeout;
    }
    this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
    return state;
  }
  forever(callback, interval = null, timeout = null, finishCallback) {
    const state = new ScheduledState(interval);
    if (timeout) {
      timeout = Date.now() + timeout;
    }
    this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
    return state;
  }
  render() {
    this.update();
    this.collisionSystem.update();
    this.context.clearRect(this.camera.startCornerX - this.camera.width / this.camera.zoom / 2, this.camera.startCornerY - this.camera.height / this.camera.zoom / 2, this.width + this.camera.width / this.camera.zoom, this.height + this.camera.height / this.camera.zoom);
    if (this.background) {
      this.context.drawImage(this.background, 0, 0, this.width, this.height);
    }
    let layers = Array.from(this.sprites.keys()).concat(Array.from(this.drawings.keys()));
    layers = layers.filter((item, pos) => layers.indexOf(item) === pos);
    layers = layers.sort((a, b) => a - b);
    for (const layer of layers) {
      if (this.drawings.has(layer)) {
        const layerDrawings = this.drawings.get(layer);
        for (const drawing of layerDrawings) {
          drawing(this.context, this);
        }
      }
      if (this.sprites.has(layer)) {
        const layerSprites = this.sprites.get(layer);
        for (const sprite of layerSprites) {
          if (sprite.hidden) {
            continue;
          }
          const distance = Math.hypot(sprite.imageCenterX - this.camera.x, sprite.imageCenterY - this.camera.y);
          const spriteRadius = Math.hypot(sprite.sourceWidth, sprite.sourceHeight) / 2 * this.camera.zoom;
          if (distance > this.camera.renderRadius + spriteRadius) {
            continue;
          }
          if (this.game.debugMode !== "none") {
            const fn = () => {
              const x = sprite.imageCenterX - this.context.measureText(sprite.name).width / 2;
              let y = sprite.imageCenterY + sprite.height + 20;
              this.context.fillStyle = this.game.debugColor;
              this.context.font = "16px Arial";
              this.context.fillText(sprite.name, x, y);
              y += 20;
              this.context.font = "14px Arial";
              this.context.fillText("x: " + sprite.x, x, y);
              y += 20;
              this.context.fillText("y: " + sprite.y, x, y);
              y += 20;
              this.context.fillText("direction: " + sprite.direction, x, y);
              y += 20;
              this.context.fillText("costume: " + sprite.getCostumeName(), x, y);
              y += 20;
              this.context.fillText("xOffset: " + sprite.pivotOffsetX, x, y);
              y += 20;
              this.context.fillText("yOffset: " + sprite.pivotOffsetY, x, y);
              this.context.beginPath();
              this.context.moveTo(sprite.globalX - 2, sprite.globalY);
              this.context.lineTo(sprite.globalX + 2, sprite.globalY);
              this.context.moveTo(sprite.globalX, sprite.globalY - 2);
              this.context.lineTo(sprite.globalX, sprite.globalY + 2);
              this.context.stroke();
            };
            if (this.game.debugMode === "hover") {
              if (sprite.touchMouse()) {
                fn();
              }
            }
            if (this.game.debugMode === "forever") {
              fn();
            }
          }
          let phrase = sprite.getPhrase();
          if (phrase) {
            this.context.font = "20px Arial";
            this.context.fillStyle = "black";
            this.context.fillText(phrase, 40, this.canvas.height - 40);
          }
          if (sprite.getCostume()) {
            this.drawSprite(sprite);
          }
          for (const drawing of sprite.drawings) {
            drawing(this.context, sprite);
          }
        }
      }
    }
    if (this.game.debugCollider) {
      this.context.strokeStyle = this.game.debugColor;
      this.context.beginPath();
      this.collisionSystem.draw(this.context);
      this.context.stroke();
    }
    this.context.translate(-this.camera.changes.x, -this.camera.changes.y);
    const centerPointX = this.width / 2 + this.camera.startCornerX;
    const centerPointY = this.height / 2 + this.camera.startCornerY;
    this.context.translate(centerPointX, centerPointY);
    this.context.scale(this.camera.changes.zoom, this.camera.changes.zoom);
    this.context.translate(-centerPointX, -centerPointY);
    this.camera.changes.reset();
  }
  update() {
    if (this.tempScheduledCallbacks.length) {
      this.scheduledCallbacks = this.scheduledCallbacks.concat(this.tempScheduledCallbacks);
      this.tempScheduledCallbacks = [];
    }
    this.scheduledCallbacks = this.scheduledCallbacks.filter(
      this.scheduledCallbackExecutor.execute(Date.now(), this.diffTime)
    );
    this.sprites.forEach((layerSprites, layer) => {
      for (const sprite of layerSprites) {
        if (sprite.deleted) {
          this.removeSprite(sprite, layer);
          return;
        }
        sprite.update(this.diffTime);
      }
    });
    this.diffTime = 0;
  }
  /**
   * Run and stop
   */
  run() {
    if (!this._stopped) {
      return;
    }
    this._stopped = false;
    for (const layerSprites of this.sprites.values()) {
      for (const sprite of layerSprites) {
        sprite.run();
      }
    }
    this.pendingRun = true;
    this.tryDoRun();
  }
  ready() {
    this.tryDoOnReady();
    this.tryDoRun();
    for (const layerSprites of this.sprites.values()) {
      for (const sprite of layerSprites) {
        sprite.ready();
      }
    }
  }
  stop() {
    if (this._stopped) {
      return;
    }
    this._running = false;
    this._stopped = true;
    for (const layerSprites of this.sprites.values()) {
      for (const sprite of layerSprites) {
        sprite.stop();
      }
    }
    this.stoppedTime = Date.now();
  }
  tryDoOnReady() {
    if (this.onReadyPending && this.isReady()) {
      this.onReadyPending = false;
      if (this.backgrounds.length && this.backgroundIndex === null) {
        this.switchBackground(0);
      }
      if (this.onReadyCallbacks.length) {
        for (const callback of this.onReadyCallbacks) {
          callback();
        }
        this.onReadyCallbacks = [];
      }
      this.game.eventEmitter.emit(Game.STAGE_READY_EVENT, {
        stage: this
      });
    }
  }
  doOnStart() {
    for (const callback of this.onStartCallbacks) {
      setTimeout(() => {
        callback();
      });
    }
  }
  tryDoRun() {
    if (this.pendingRun && !this._running && this.isReady()) {
      this._running = true;
      this.pendingRun = false;
      this.doOnStart();
      this.diffTime = Date.now() - this.stoppedTime;
      setTimeout(() => {
        const stoppedTime = this.stoppedTime;
        const loop = () => {
          if (this._stopped || stoppedTime !== this.stoppedTime) {
            return;
          }
          this.render();
          requestAnimationFrame(loop);
        };
        loop();
      });
    }
  }
  addListeners() {
    this.eventEmitter.on(Game.SPRITE_READY_EVENT, Game.SPRITE_READY_EVENT, (event) => {
      if (this.id == event.detail.stageId) {
        this.loadedSprites++;
        this.tryDoOnReady();
        this.tryDoRun();
      }
    });
  }
};

// src/MultiplayerControl.ts
var MultiplayerControl = class {
  constructor(player, game, connection, isMe) {
    this.trackedKeys = [];
    this.receiveDataConnections = [];
    this.userKeydownCallbacks = /* @__PURE__ */ new Map();
    this.systemLockedChars = {};
    this.userLockedChars = {};
    this.systemMouseLocked = false;
    this.userMouseLocked = false;
    this.game = game;
    this.connection = connection;
    if (isMe) {
      this.defineListeners();
    }
    const keydownConnection = connection.connect(JetcodeSocket.RECEIVE_DATA, (dataJson, parameters) => {
      const data = JSON.parse(dataJson);
      const char = data["char"];
      if (!parameters.SendTime || parameters.Keydown != "true" || parameters.MemberId != player.id || !this.trackedKeys.includes(char)) {
        return;
      }
      if (this.userKeydownCallbacks.has(char)) {
        const callback = this.userKeydownCallbacks.get(char)[0];
        const block = (isBlock, chars = [char], mouse = false) => {
          if (mouse) {
            this.userMouseLocked = isBlock;
          }
          for (const char2 of chars) {
            this.userLockedChars[char2.toUpperCase()] = isBlock;
          }
        };
        let attempts = 0;
        const handler = () => {
          if (this.userLockedChars[char] !== true || attempts > 999) {
            const syncData = data["sync"];
            if (syncData) {
              game.syncObjects(syncData, this.game.calcDeltaTime(parameters.SendTime));
            }
            callback(player, block);
          } else {
            attempts++;
            setTimeout(handler, 50);
          }
        };
        handler();
      }
      this.systemLockedChars[char] = false;
    });
    this.receiveDataConnections.push(keydownConnection);
    const mousedownConnection = connection.connect(JetcodeSocket.RECEIVE_DATA, (dataJson, parameters) => {
      if (!parameters.SendTime || parameters.Mousedown != "true" || parameters.MemberId != player.id) {
        return;
      }
      if (this.userMousedownCallback) {
        const callback = this.userMousedownCallback[0];
        const data = JSON.parse(dataJson);
        const mouseX = data["mouseX"];
        const mouseY = data["mouseY"];
        const syncData = data["sync"];
        const block = (isBlock, chars = [], mouse = true) => {
          if (mouse) {
            this.userMouseLocked = isBlock;
          }
          for (const char of chars) {
            this.userLockedChars[char.toUpperCase()] = isBlock;
          }
        };
        let attempts = 0;
        const handler = () => {
          if (this.userMouseLocked !== true || attempts > 999) {
            if (syncData) {
              game.syncObjects(syncData, this.game.calcDeltaTime(parameters.SendTime));
            }
            const mousePoint = new PointCollider(mouseX, mouseY);
            callback(mousePoint, player, block);
          } else {
            attempts++;
            setTimeout(handler, 50);
          }
        };
        handler();
      }
      this.systemMouseLocked = false;
    });
    this.receiveDataConnections.push(mousedownConnection);
  }
  defineListeners() {
    this.keydownCallback = (event) => {
      const char = KeyboardMap.getChar(event.keyCode);
      if (!this.userKeydownCallbacks.has(char) || this.systemLockedChars[char] === true || this.userLockedChars[char] === true || !this.trackedKeys.includes(char)) {
        return;
      }
      this.systemLockedChars[char] = true;
      const syncPackName = this.userKeydownCallbacks.get(char)[1];
      const syncData = this.userKeydownCallbacks.get(char)[2];
      const syncDataPacked = this.game.packSyncData(syncPackName, syncData);
      this.connection.sendData(JSON.stringify({
        "char": char,
        "sync": syncDataPacked
      }), {
        Keydown: "true"
      });
    };
    this.mousedownCallback = (event) => {
      if (!this.userMousedownCallback || this.systemMouseLocked || this.userMouseLocked) {
        return;
      }
      const mouseX = this.game.correctMouseX(event.clientX);
      const mouseY = this.game.correctMouseY(event.clientY);
      if (!this.game.isInsideGame(mouseX, mouseY)) {
        return;
      }
      this.systemMouseLocked = true;
      const syncPackName = this.userMousedownCallback[1];
      const syncData = this.userMousedownCallback[2];
      const syncDataPacked = this.game.packSyncData(syncPackName, syncData);
      this.connection.sendData(JSON.stringify({
        "mouseX": mouseX,
        "mouseY": mouseY,
        "sync": syncDataPacked
      }), {
        Mousedown: "true"
      });
    };
    document.addEventListener("keydown", this.keydownCallback);
    document.addEventListener("mousedown", this.mousedownCallback);
  }
  stop() {
    if (this.keydownCallback) {
      document.removeEventListener("keydown", this.keydownCallback);
    }
    for (const connection of this.receiveDataConnections) {
      this.connection.disconnect(JetcodeSocket.RECEIVE_DATA, connection);
    }
  }
  keyDown(char, callback, syncPackName, syncData = []) {
    char = char.toUpperCase();
    if (!this.trackedKeys.includes(char)) {
      this.trackedKeys.push(char);
    }
    this.userKeydownCallbacks.set(char, [callback, syncPackName, syncData]);
  }
  removeKeyDownHandler(char) {
    char = char.toUpperCase();
    this.userKeydownCallbacks.delete(char);
  }
  mouseDown(callback, syncPackName, syncData = []) {
    this.userMousedownCallback = [callback, syncPackName, syncData];
  }
  removeMouseDownHandler() {
    this.userMousedownCallback = null;
  }
};

// src/OrphanSharedData.ts
var OrphanSharedData = class {
  constructor(parent, properties) {
    this.parent = parent;
    this.properties = properties;
  }
  getMultiplayerName() {
    return this.parent.getMultiplayerName();
  }
  getSyncId() {
    return this.parent.getSyncId();
  }
  increaseSyncId() {
    return this.parent.increaseSyncId();
  }
  getSyncData() {
    const syncData = {};
    for (const property of this.properties) {
      if (this.parent[property]) {
        syncData[property] = this.parent[property];
      }
    }
    return syncData;
  }
  setSyncData(packName, data, deltaTime) {
    this.parent.setSyncData(packName, data, deltaTime);
  }
  onSync(callback) {
    throw new Error("Not implemented.");
  }
  removeSyncHandler() {
    throw new Error("Not implemented.");
  }
  only(...properties) {
    throw new Error("Not implemented.");
  }
};

// src/Player.ts
var Player = class {
  constructor(id, isMe, game) {
    this.deleted = false;
    this.id = id;
    this._isMe = isMe;
    this.game = game;
    this.multiplayerName = "player_" + id;
    this.syncId = 1;
    this.control = new MultiplayerControl(this, this.game, game.connection, isMe);
    this.reservedProps = Object.keys(this);
    this.reservedProps.push("reservedProps");
  }
  keyDown(char, callback, syncPackName, syncData = []) {
    this.control.keyDown(char, callback, syncPackName, syncData);
  }
  removeKeyDownHandler(char) {
    this.control.removeKeyDownHandler(char);
  }
  mouseDown(callback, syncPackName, syncData = []) {
    this.control.mouseDown(callback, syncPackName, syncData);
  }
  removeMouseDownHandler() {
    this.control.removeMouseDownHandler();
  }
  isMe() {
    return this._isMe;
  }
  delete() {
    if (this.deleted) {
      return;
    }
    this.control.stop();
    let props = Object.keys(this);
    for (let i = 0; i < props.length; i++) {
      delete this[props[i]];
    }
    this.deleted = true;
  }
  repeat(i, callback, timeout, finishCallback) {
    if (this.deleted) {
      finishCallback();
      return;
    }
    if (i < 1) {
      finishCallback();
      return;
    }
    const result = callback(this);
    if (result === false) {
      finishCallback();
      return;
    }
    if (result > 0) {
      timeout = result;
    }
    i--;
    if (i < 1) {
      finishCallback();
      return;
    }
    setTimeout(() => {
      requestAnimationFrame(() => this.repeat(i, callback, timeout, finishCallback));
    }, timeout);
  }
  forever(callback, timeout = null) {
    if (this.deleted) {
      return;
    }
    const result = callback(this);
    if (result === false) {
      return;
    }
    if (result > 0) {
      timeout = result;
    }
    if (timeout) {
      setTimeout(() => {
        requestAnimationFrame(() => this.forever(callback, timeout));
      }, timeout);
    } else {
      requestAnimationFrame(() => this.forever(callback));
    }
  }
  timeout(callback, timeout) {
    setTimeout(() => {
      if (this.deleted) {
        return;
      }
      requestAnimationFrame(() => callback(this));
    }, timeout);
  }
  getMultiplayerName() {
    return this.multiplayerName;
  }
  getSyncId() {
    return this.syncId;
  }
  increaseSyncId() {
    this.syncId++;
    return this.syncId;
  }
  getSyncData() {
    const data = {};
    for (const key of Object.keys(this)) {
      if (this.reservedProps.includes(key)) {
        continue;
      }
      data[key] = this[key];
    }
    return data;
  }
  setSyncData(packName, data, deltaTime) {
    const oldData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && !this.reservedProps.includes(key)) {
        oldData[key] = this[key];
        this[key] = data[key];
      }
    }
    if (this.syncCallback) {
      this.syncCallback(this, packName, data, oldData, deltaTime);
    }
  }
  onSync(callback) {
    this.syncCallback = callback;
  }
  removeSyncHandler() {
    this.syncCallback = null;
  }
  only(...properties) {
    return new OrphanSharedData(this, properties);
  }
};

// src/MultiplayerSprite.ts
var MultiplayerSprite = class extends Sprite {
  constructor(multiplayerName, stage = null, layer = 1, costumePaths = []) {
    super(stage, layer, costumePaths);
    this.multiplayerName = "sprite_" + multiplayerName;
    this.syncId = 1;
    this.reservedProps = Object.keys(this);
    this.reservedProps.push("body");
    this.reservedProps.push("reservedProps");
  }
  generateUniqueId() {
    return Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2);
  }
  getCustomerProperties() {
    const data = {};
    for (const key of Object.keys(this)) {
      if (this.reservedProps.includes(key)) {
        continue;
      }
      data[key] = this[key];
    }
    return data;
  }
  getMultiplayerName() {
    return this.multiplayerName;
  }
  getSyncId() {
    return this.syncId;
  }
  increaseSyncId() {
    this.syncId++;
    return this.syncId;
  }
  getSyncData() {
    return Object.assign({}, this.getCustomerProperties(), {
      size: this.size,
      rotateStyle: this.rotateStyle,
      costumeIndex: this.costumeIndex,
      deleted: this._deleted,
      x: this.x,
      y: this.y,
      direction: this.direction,
      hidden: this.hidden,
      stopped: this.stopped
    });
  }
  setSyncData(packName, data, deltaTime) {
    const oldData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && !this.reservedProps.includes(key)) {
        oldData[key] = this[key];
        this[key] = data[key];
      }
    }
    if (this.syncCallback) {
      this.syncCallback(this, packName, data, oldData, deltaTime);
    }
  }
  onSync(callback) {
    this.syncCallback = callback;
  }
  removeSyncHandler() {
    this.syncCallback = null;
  }
  only(...properties) {
    return new OrphanSharedData(this, properties);
  }
};

// src/MultiplayerGame.ts
var MultiplayerGame = class extends Game {
  constructor(socketUrl, gameToken, width, height, canvasId = null, displayErrors = true, locale = "ru", lobbyId = 0, autoSyncGame = 0, multiplayerOptions = {}) {
    super(width, height, canvasId, displayErrors, locale);
    this.autoSyncGameTimeout = 0;
    this.players = [];
    this.sharedObjects = [];
    this.autoSyncGameTimeout = autoSyncGame;
    this.initializeConnection(socketUrl, gameToken, lobbyId, multiplayerOptions);
  }
  send(userData, parameters = {}, syncPackName, syncData = []) {
    if (!this.connection) {
      throw new Error("Connection to the server is not established.");
    }
    const data = {
      "data": userData,
      "sync": this.packSyncData(syncPackName, syncData)
    };
    this.connection.sendData(JSON.stringify(data), parameters);
  }
  sync(syncPackName, syncData = [], parameters = {}) {
    if (!syncData.length) {
      return;
    }
    parameters.SyncGame = "true";
    const data = this.packSyncData(syncPackName, syncData);
    this.sendData(JSON.stringify(data), parameters);
  }
  syncGame() {
    const syncObjects = this.getSyncObjects();
    const syncData = this.packSyncData("game", syncObjects);
    this.sendData(JSON.stringify(syncData), {
      SyncGame: "true"
    });
  }
  onConnection(callback) {
    this.onConnectionCallback = callback;
  }
  removeConnectionHandler(callback) {
    this.onConnectionCallback = null;
  }
  onReceive(callback) {
    this.onReceiveCallback = callback;
  }
  removeReceiveHandler(callback) {
    this.onReceiveCallback = null;
  }
  onMemberJoined(callback) {
    this.onMemberJoinedCallback = callback;
  }
  removeMemberJoinedHandler(callback) {
    this.onMemberJoinedCallback = null;
  }
  onMemberLeft(callback) {
    this.onMemberLeftCallback = callback;
  }
  removeMemberLeftHandler(callback) {
    this.onMemberLeftCallback = null;
  }
  onGameStarted(callback) {
    this.onGameStartedCallback = callback;
  }
  removeGameStartedHandler(callback) {
    this.onGameStartedCallback = null;
  }
  onGameStopped(callback) {
    this.onGameStoppedCallback = callback;
  }
  removeGameStoppedHandler(callback) {
    this.onGameStoppedCallback = null;
  }
  onMultiplayerError(callback) {
    this.onMultiplayerErrorCallback = callback;
  }
  removeMultiplayerErrorHandler(callback) {
    this.onMultiplayerErrorCallback = null;
  }
  run() {
    super.run();
    if (this.isHost && this.autoSyncGameTimeout) {
      this.autoSyncGame(this.autoSyncGameTimeout);
    }
  }
  stop() {
    super.stop();
    for (const player of this.players) {
      player.delete();
    }
    this.players = [];
  }
  getPlayers() {
    return this.players;
  }
  addSharedObject(sharedObject) {
    this.sharedObjects.push(sharedObject);
  }
  removeSharedObject(sharedObject) {
    const index = this.sharedObjects.indexOf(sharedObject);
    if (index > -1) {
      this.sharedObjects.splice(index, 1);
    }
  }
  getSharedObjects() {
    return this.sharedObjects;
  }
  getMultiplayerSprites() {
    if (!this.getActiveStage()) {
      return [];
    }
    return this.getActiveStage().getSprites().filter((sprite) => {
      return sprite instanceof MultiplayerSprite;
    });
  }
  getSyncObjects() {
    const multiplayerSprites = this.getMultiplayerSprites();
    const players = this.getPlayers();
    const sharedObjects = this.getSharedObjects();
    return [...multiplayerSprites, ...players, ...sharedObjects];
  }
  syncObjects(syncData, deltaTime) {
    const gameAllSyncObjects = this.getSyncObjects();
    for (const [syncPackName, syncObjectsData] of Object.entries(syncData)) {
      for (const syncObject of gameAllSyncObjects) {
        if (syncObjectsData[syncObject.getMultiplayerName()]) {
          const syncPackData = syncObjectsData[syncObject.getMultiplayerName()];
          syncObject.setSyncData(syncPackName, syncPackData, deltaTime);
        }
      }
    }
  }
  packSyncData(packName, syncObjects) {
    const syncObjectsData = {};
    for (const syncObject of syncObjects) {
      syncObjectsData[syncObject.getMultiplayerName()] = syncObject.getSyncData();
      syncObjectsData[syncObject.getMultiplayerName()]["syncId"] = syncObject.increaseSyncId();
    }
    const result = {};
    result[packName] = syncObjectsData;
    return result;
  }
  sendData(data, parameters = {}) {
    if (!this.connection) {
      throw new Error("Connection to the server is not established.");
    }
    this.connection.sendData(data, parameters);
  }
  calcDeltaTime(sendTime) {
    return Date.now() - sendTime - this.connection.deltaTime;
  }
  extrapolate(callback, deltaTime, timeout) {
    const times = Math.round(deltaTime / timeout * 0.75);
    for (let i = 0; i < times; i++) {
      callback();
    }
  }
  async initializeConnection(socketUrl, gameToken, lobbyId, multiplayerOptions = {}) {
    const socket = new JetcodeSocket(socketUrl);
    try {
      this.connection = await socket.connect(gameToken, lobbyId, multiplayerOptions);
      if (this.onConnectionCallback) {
        this.onConnectionCallback(this.connection);
      }
      this.connection.connect(JetcodeSocket.RECEIVE_DATA, (data, parameters, isMe) => {
        if (!data || !this.running || !parameters.SendTime) {
          return;
        }
        if (parameters.SyncGame === "true") {
          const syncObjectsData = JSON.parse(data);
          this.syncObjects(syncObjectsData, this.calcDeltaTime(parameters.SendTime));
        } else if (parameters.Keydown !== "true" && parameters.Mousedown !== "true" && this.onReceiveCallback) {
          data = JSON.parse(data);
          const userData = data["userData"];
          const syncSpritesData = data["sync"];
          this.syncObjects(syncSpritesData, this.calcDeltaTime(parameters.SendTime));
          this.onReceiveCallback(userData, parameters, isMe);
        }
      });
      this.connection.connect(JetcodeSocket.MEMBER_JOINED, (parameters, isMe) => {
        if (this.onMemberJoinedCallback) {
          this.onMemberJoinedCallback(parameters, isMe);
        }
      });
      this.connection.connect(JetcodeSocket.MEMBER_LEFT, (parameters, isMe) => {
        if (this.onMemberLeftCallback) {
          this.onMemberLeftCallback(parameters, isMe);
        }
      });
      this.connection.connect(JetcodeSocket.GAME_STARTED, (parameters) => {
        const hostId = parameters.HostId;
        const playerIds = parameters.Members?.split(",") ?? [];
        this.players = playerIds.map((playerId) => {
          return new Player(playerId, playerId === this.connection.memberId, this);
        });
        this.isHost = hostId === this.connection.memberId;
        if (this.onGameStartedCallback) {
          this.onGameStartedCallback(this.players, parameters);
        }
      });
      this.connection.connect(JetcodeSocket.GAME_STOPPED, (parameters) => {
        if (this.onGameStoppedCallback) {
          this.onGameStoppedCallback(parameters);
        }
      });
      this.connection.connect(JetcodeSocket.ERROR, (parameters) => {
        if (this.onMultiplayerError) {
          this.onMultiplayerError(parameters);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  autoSyncGame(timeout) {
    const hander = () => {
      this.syncGame();
    };
    setInterval(hander, timeout);
  }
};

// src/SharedData.ts
var SharedData = class {
  constructor(multiplayerName) {
    this.multiplayerName = "data_" + multiplayerName;
    this.syncId = 1;
    if (!Registry.getInstance().has("game")) {
      throw new Error("You need create Game instance before Sprite instance.");
    }
    const game = Registry.getInstance().get("game");
    game.addSharedObject(this);
  }
  generateUniqueId() {
    return Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2);
  }
  getMultiplayerName() {
    return this.multiplayerName;
  }
  getSyncId() {
    return this.syncId;
  }
  increaseSyncId() {
    this.syncId++;
    return this.syncId;
  }
  getSyncData() {
    const data = {};
    for (const key of Object.keys(this)) {
      data[key] = this[key];
    }
    return data;
  }
  setSyncData(packName, data, deltaTime) {
    const oldData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        oldData[key] = this[key];
        this[key] = data[key];
      }
    }
    if (this.syncCallback) {
      this.syncCallback(this, packName, data, oldData, deltaTime);
    }
  }
  onSync(callback) {
    this.syncCallback = callback;
  }
  removeSyncHandler() {
    this.syncCallback = null;
  }
  only(...properties) {
    return new OrphanSharedData(this, properties);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BVH,
  BVHBranch,
  Camera,
  CameraChanges,
  CircleCollider,
  Collider,
  CollisionResult,
  CollisionSystem,
  Costume,
  ErrorMessages,
  EventEmitter,
  Game,
  JetcodeSocket,
  JetcodeSocketConnection,
  Keyboard,
  KeyboardMap,
  Mouse,
  MultiplayerControl,
  MultiplayerGame,
  MultiplayerSprite,
  OrphanSharedData,
  Player,
  PointCollider,
  PolygonCollider,
  Registry,
  SAT,
  ScheduledCallbackExecutor,
  ScheduledCallbackItem,
  ScheduledState,
  SharedData,
  Sprite,
  Stage,
  Styles,
  ValidatorFactory,
  aabbAABB,
  circleCircle,
  polygonCircle,
  polygonPolygon,
  separatingAxis
});
