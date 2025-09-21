import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as cocossd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import { drawRect } from './utilities';
import { Box, Card } from '@mui/material';
import swal from 'sweetalert';
import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({ publicKey: 'e69ab6e5db6d4a41760b' });

export default function Home({ cheatingLog, updateCheatingLog }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [lastDetectionTime, setLastDetectionTime] = useState({});

  const captureScreenshotAndUpload = useCallback(async (type) => {
    console.log(`🎯 Starting screenshot capture for: ${type}`);
    
    const video = webcamRef.current?.video;

    if (
      !video ||
      video.readyState !== 4 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      console.warn('❌ Video not ready for screenshot:', {
        video: !!video,
        readyState: video?.readyState,
        videoWidth: video?.videoWidth,
        videoHeight: video?.videoHeight
      });
      return null;
    }

    console.log(`📹 Video ready - dimensions: ${video.videoWidth}x${video.videoHeight}`);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Add quality parameter
    console.log(`🖼️ Canvas created, data URL length: ${dataUrl.length}`);
    
    const file = dataURLtoFile(dataUrl, `cheating_${type}_${Date.now()}.jpg`);
    console.log(`📁 File created:`, file);

    try {
      console.log(`☁️ Uploading to Uploadcare...`);
      const result = await client.uploadFile(file);
      console.log('✅ Uploaded to Uploadcare:', result.cdnUrl);
      
      const screenshot = {
        url: result.cdnUrl,
        type: type,
        detectedAt: new Date().toISOString()
      };

      return screenshot;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      return null;
    }
  }, []);

  const handleDetection = useCallback(async (type) => {
    const now = Date.now();
    const lastTime = lastDetectionTime[type] || 0;

    console.log(`🚨 Detection triggered: ${type}, last detection: ${now - lastTime}ms ago`);

    if (now - lastTime >= 3000) {
      console.log(`⏰ Cooldown passed, processing ${type} detection...`);
      setLastDetectionTime((prev) => ({ ...prev, [type]: now }));

      // Capture and upload screenshot
      console.log(`📸 Attempting to capture screenshot for ${type}...`);
      const screenshot = await captureScreenshotAndUpload(type);
      
      if (screenshot) {
        console.log(`✅ Screenshot captured successfully:`, screenshot);
      } else {
        console.warn(`❌ Screenshot capture failed for ${type}`);
      }
      
      // Update cheating log with new count and screenshot
      const currentCount = parseInt(cheatingLog[`${type}Count`]) || 0;
      const currentScreenshots = Array.isArray(cheatingLog.screenshots) ? cheatingLog.screenshots : [];
      
      const updatedLog = {
        ...cheatingLog,
        [`${type}Count`]: currentCount + 1,
        screenshots: screenshot ? [...currentScreenshots, screenshot] : currentScreenshots
      };

      console.log(`📊 ${type} detected. Count: ${currentCount + 1}, Screenshots: ${updatedLog.screenshots.length}`);
      console.log(`📝 Updated log:`, updatedLog);
      
      updateCheatingLog(updatedLog);

      // Show warning to user
      switch (type) {
        case 'noFace':
          swal('Face Not Visible', 'Warning Recorded - Keep your face visible to the camera', 'warning');
          break;
        case 'multipleFace':
          swal('Multiple Faces Detected', 'Warning Recorded - Only one person should be visible', 'warning');
          break;
        case 'cellPhone':
          swal('Cell Phone Detected', 'Warning Recorded - Remove all electronic devices', 'warning');
          break;
        case 'prohibitedObject':
          swal('Prohibited Object Detected', 'Warning Recorded - Remove all prohibited items', 'warning');
          break;
        default:
          break;
      }
    } else {
      console.log(`⏳ Cooldown active for ${type}, ignoring detection (${3000 - (now - lastTime)}ms remaining)`);
    }
  }, [lastDetectionTime, captureScreenshotAndUpload, cheatingLog, updateCheatingLog]);

  const detect = useCallback(async (net) => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      try {
        const obj = await net.detect(video);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawRect(obj, ctx);

        let person_count = 0;
        let faceDetected = false;
        const detectedObjects = [];

        obj.forEach((element) => {
          const detectedClass = element.class;
          const confidence = (element.score * 100).toFixed(1);
          detectedObjects.push(`${detectedClass} (${confidence}%)`);

          if (detectedClass === 'cell phone') {
            console.log(`📱 Cell phone detected with ${confidence}% confidence`);
            handleDetection('cellPhone');
          }
          if (detectedClass === 'book' || detectedClass === 'laptop') {
            console.log(`📚 Prohibited object detected: ${detectedClass} with ${confidence}% confidence`);
            handleDetection('prohibitedObject');
          }
          if (detectedClass === 'person') {
            faceDetected = true;
            person_count++;
            console.log(`👤 Person detected (count: ${person_count}) with ${confidence}% confidence`);
            if (person_count > 1) {
              console.log(`👥 Multiple people detected: ${person_count}`);
              handleDetection('multipleFace');
            }
          }
        });

        if (detectedObjects.length > 0) {
          console.log(`🔍 Objects detected:`, detectedObjects.join(', '));
        }

        if (!faceDetected) {
          console.log(`👻 No face detected - triggering noFace violation`);
          handleDetection('noFace');
        }
      } catch (error) {
        console.error('❌ Error during detection:', error);
      }
    } else {
      console.log('📹 Video not ready for detection');
    }
  }, [handleDetection]);

  const runCoco = useCallback(async () => {
    try {
      console.log('🤖 Initializing TensorFlow.js...');
      
      // Set TensorFlow.js backend to webgl for better performance
      if (!tf.getBackend()) {
        console.log('🔧 Setting TensorFlow.js backend to webgl...');
        await tf.setBackend('webgl');
      }
      
      // Wait for TensorFlow.js to be ready
      await tf.ready();
      console.log('✅ TensorFlow.js backend ready:', tf.getBackend());
      
      console.log('🤖 Loading COCO-SSD model...');
      const net = await cocossd.load();
      console.log('✅ AI model loaded successfully');
      const intervalId = setInterval(() => detect(net), 1000);
      
      // Return cleanup function
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('❌ Error loading AI model:', error);
      console.error('Available backends:', tf.engine().backendNames);
      
      // Try fallback to CPU backend
      try {
        console.log('🔄 Trying fallback to CPU backend...');
        await tf.setBackend('cpu');
        await tf.ready();
        const net = await cocossd.load();
        console.log('✅ AI model loaded with CPU backend');
        const intervalId = setInterval(() => detect(net), 1000);
        return () => clearInterval(intervalId);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        swal('Error', 'Failed to load AI model. Please refresh the page.', 'error');
        return () => {};
      }
    }
  }, [detect]);

  useEffect(() => {
    let cleanup = null;
    
    const initializeAI = async () => {
      cleanup = await runCoco();
    };
    
    initializeAI();
    
    // Cleanup interval on unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, [runCoco]);

  return (
    <Box>
      <Card variant="outlined" sx={{ position: 'relative', width: '100%', height: '100%' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          muted
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        />
      </Card>
    </Box>
  );
}

// Helper to convert base64 to File
function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], fileName, { type: mime });
}
