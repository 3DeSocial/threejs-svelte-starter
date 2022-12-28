import Deso from 'deso-protocol'; 
import * as D3D from 'd3d';
 

  const sceneryName = 'amphitheater';


	const sceneryOptions = {
		'amphitheater':{
		hasCircleLayout: true,
		radius: 20,
		sceneryPath: '/models/scenery/vr_art_gallery_3_baked.glb',
		sceneScale: 1.5,
		playerStartPos: { x: -0, y: 2 ,z: 0 },
		}
	}

  const config = {
    walkSpeed: 5,
    defaultLoader: 'gltf',
    firstPerson: true,    
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
    playerStartPos: {x:0,y:3,z:0},  // location in the environment where the player will appear
    avatarSize: {width: 1, height:1, depth:1}, // Max dimensions of avatar
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

export const createScene = (el,data) => {
    console.log('got postHash', data.postHash);
  getPost(data.postHash).then((post)=>{
      console.log(post);
    });     
    config.el = el;
  	let spaceViewer = new D3D.SpaceViewer(config);	
    let params = {};
	  spaceViewer.initSpace(params)

  
};

const getPost = async (hash)=>{
  const deso = new Deso();

  const request = {
    "PostHashHex": hash
  };
  return await deso.posts.getSinglePost(request);
}