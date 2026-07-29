export async function cropImage(
    imageSrc: string,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
  
        canvas.width = cropWidth;
        canvas.height = cropHeight;
  
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          reject("Unable to create canvas.");
          return;
        }
  
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
  
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
  
      image.onerror = reject;
  
      image.src = imageSrc;
    });
  }