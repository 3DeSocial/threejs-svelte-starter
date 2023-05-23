import { getUsersStateless, getPostsStateless } from 'deso-protocol';

let workers =[];
const workerURL = new URL('./workers/canvasWorker.js', import.meta.url);

export const createScene = async (el, width,height) => {

    let images = await getPostImages();
    console.log('images: ',images);
    let canvasWorker = new Worker(workerURL, { type: "module" });
    const offscreen = el.transferControlToOffscreen();

    
    let payload = { 
        method: 'canvas',
        canvas: offscreen,
        height: height,
        width: width,
        images: images
      }


    canvasWorker.postMessage(payload, [offscreen]);


    window.addEventListener('resize', (e) => {

        let canvas = document.getElementById('app-canvas');
        width = window.innerWidth;
        height = window.innerHeight;
        let payload = { method: 'resize',
            height: height,
            width: width
          }
        canvasWorker.postMessage(payload);   
      });    
      window.dispatchEvent(new Event('resize'));      
      /*DeSo.configure({
        
          spendingLimitOptions: {
            // NOTE: this value is in Deso nanos, so 1 Deso * 1e9
            GlobalDESOLimit: 10 * 1e9, // 1 Deso
            // Map of transaction type to the number of times this derived key is
            // allowed to perform this operation on behalf of the owner public key
            TransactionCountLimitMap: {
              BASIC_TRANSFER: 20, // 2 basic transfer transactions are authorized
              SUBMIT_POST: 4, // 4 submit post transactions are authorized
            }
          },
          appName: 'Flyposter'
  });*/
}

const getPostImages = async()=>{
  let images = [];
  let posts = await getPosts();
  posts.forEach(post => {
    if(post.ImageURLs!==null){
      let imgData = {url:post.ImageURLs[0],
                    description: post.Body,
                    user:post.ProfileEntryResponse?.Username,
                    userDesc: post.ProfileEntryResponse?.Description,
                    userPk: post.ProfileEntryResponse?.PublicKeyBase58Check
      };
      images.push(imgData);
    }
    
  });
  return images;

}
const getPosts = async ()=>{
  let res = await getPostsStateless({NumToFetch: 200, MediaRequired: true});
  return res.PostsFound;
}
