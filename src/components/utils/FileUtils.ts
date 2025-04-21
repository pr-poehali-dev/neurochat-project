/**
 * Utility functions for file handling
 */

/**
 * Saves a file (blob) to the user's device
 * @param blob The blob to save
 * @param fileName The name of the file to save
 */
export const saveFile = async (blob: Blob, fileName: string): Promise<void> => {
  // Create a link element
  const a = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set the link's properties
  a.href = url;
  a.download = fileName;
  
  // Append to the body, click, and remove
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Fetches and converts a remote image to a blob
 * @param url The URL of the image
 * @returns A Promise resolving to a Blob
 */
export const getImageBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  return await response.blob();
};

/**
 * Creates a base64 data URL from text content (for saving text as files)
 * @param content The text content
 * @param mimeType The MIME type of the content
 * @returns A data URL
 */
export const createTextFileUrl = (content: string, mimeType = 'text/plain'): string => {
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
};

/**
 * Generates random placeholder images of the specified dimensions
 * @param width The width of the image
 * @param height The height of the image
 * @param text Optional text to display in the image
 * @returns A data URL for the generated image
 */
export const generatePlaceholderImage = (
  width: number = 400, 
  height: number = 300, 
  text: string = 'Generated Image'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#9b87f5');
  gradient.addColorStop(1, '#6E59A5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some random shapes
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 50 + 20,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  // Add text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Add watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '14px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('HGPT Pro', width - 10, height - 10);
  
  return canvas.toDataURL('image/png');
};

/**
 * Creates a mock video blob
 * @returns A Promise resolving to a Blob
 */
export const createMockVideoBlob = async (
  text: string = 'Generated Video'
): Promise<Blob> => {
  // In a real app, this would be replaced with actual video generation
  // For now, we'll create a mock video using canvas and MediaRecorder
  
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');
  
  // Create a stream from the canvas
  const stream = canvas.captureStream(30); // 30 FPS
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  
  // Start recording
  mediaRecorder.start();
  
  // Draw animation frames (simple gradient animation with text)
  let frame = 0;
  const totalFrames = 60; // 2 seconds at 30fps
  
  const drawFrame = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#9b87f5');
    gradient.addColorStop((frame / totalFrames) % 1, '#D6BCFA');
    gradient.addColorStop(1, '#6E59A5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Draw progress bar
    ctx.fillStyle = 'white';
    ctx.fillRect(100, canvas.height - 50, (canvas.width - 200) * (frame / totalFrames), 10);
    
    // Draw watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('HGPT Pro', canvas.width - 20, canvas.height - 20);
    
    frame++;
    if (frame < totalFrames) {
      requestAnimationFrame(drawFrame);
    } else {
      mediaRecorder.stop();
    }
  };
  
  drawFrame();
  
  // Return promise that resolves with the video blob
  return new Promise(resolve => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
  });
};
