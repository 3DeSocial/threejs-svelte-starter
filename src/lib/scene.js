
export const createScene = (el) => {
console.log('el',el);

    const offscreen = document.querySelector(el).transferControlToOffscreen();
 //   const worker = new Worker('worker.js');
   // worker.postMessage({ canvas: offscreen }, [offscreen]);
};

