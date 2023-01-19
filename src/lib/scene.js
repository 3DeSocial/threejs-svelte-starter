import * as D3D from 'd3d';

const getParameterByName =(name) =>{
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let avatar = getParameterByName('avatar');
console.log('avatar selected: ',avatar);

  const sceneryName = 'amphitheater';
  const avatars = {'Chubby':'ChubbyRigged.fbx','Buffed':'BuffedRigged.fbx','Female':'FemaleRigged.fbx','Male':'MaleRigged.fbx'};
	const sceneryOptions = {
		'amphitheater':{
		hasCircleLayout: true,
		radius: 20,
		sceneryPath: '/models/scenery/vr_art_gallery_9_two_octahedra_baked.glb',
		sceneScale: 1.5,
		playerStartPos: { x: 4, y: 1 ,z: 5 },
		}
	}

  const config = {
  // avatarPath:  '/models/avatars/vroid-anime-girl.vrm',
    //avatarPath:  '/models/avatars/vroid-anime-girl2.vrm',



  //  avatarPath:  '/models/avatars/ghostHQ.fbx',
//    avatarPath:  'https://desodata.azureedge.net/unzipped/afa02ebe8c02c6f8f22ca46031e048b69a6b2add303ffae538bb95bf6adb6db7/vrm/normal/European%2520Male1_High%2520Volume%2520Brushed%2520Up_Deso%2520Casual.vrm',
    avatarPath:  '/models/avatars/',
    avatars: avatars,
    avatar: avatar, //default avatar
    walkSpeed: 5,
    defaultLoader: 'gltf',
    firstPerson: false,    
   // imageProxyUrl: PROXYURL,
    ctrClass: 'space-ctr', // Attribute of div containing post and any additionl html
    linkText: 'View in 3D',
    linkCtrCls: 'nft-viewer', // container for links such as view in 3d, view in vr
    modelsRoute: 'https://desodata.azureedge.net', // Back end route to load models    
    nftsRoute: 'https://backend.nftz.zone/api/post/get3DScene',
    previewCtrCls: 'container', //container element in which to create the preview
    skyboxes: true,
    skyboxPath: 'https://bitcloutweb.azureedge.net/public/3d/images/skyboxes',
    sceneryPath: 'https://bitcloutweb.azureedge.net/public/3d/models/large_round_gallery_room/scene.gltf',
    scaleModelToHeight:2,
    scaleModelToWidth: 2,
    scaleModelToDepth: 2,   
    playerStartPos: { x: -4, y: 2 ,z: -5 },  // location in the environment where the player will appear
    avatarSize: {width: 1, height:2, depth:2}, // Max dimensions of avatar
    vrType:'walking', // default to walking unless vrcontrols=flying is in url params
    sceneryOptions: sceneryOptions[sceneryName],
   
    //Pass Blockchain API functions
    chainAPI: {
      fetchPost: function(params){
      },
      fetchPostDetail: function(params){
        return fetch('https://backend.nftz.zone/api/post/getnft?hash='+params.postHashHex );
      }
    }
  }; 

export const createScene = (el) => {
    config.el = el;
  	let spaceViewer = new D3D.SpaceViewer(config);	
    let params = {};
	  spaceViewer.initSpace(params);
};

