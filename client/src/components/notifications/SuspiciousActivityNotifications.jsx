import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axios';

const SuspiciousActivityNotifications = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [lastNotificationTime, setLastNotificationTime] = useState(Date.now());
  const [isTeacher, setIsTeacher] = useState(false);
  console.log("token", localStorage.getItem("token"));
  useEffect(() => {
    setIsTeacher(userInfo?.role === 'teacher');
  }, [userInfo]);

  useEffect(() => {
    if (!isTeacher) return;

    // Check for new suspicious activities every 10 seconds
    const interval = setInterval(async () => {
      try {
        // Get all exams
  const examsResponse = await axiosInstance.get(
  '/api/users/exam',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

        const exams = examsResponse.data || [];

        let newSuspiciousActivities = [];

        // Check each exam for recent suspicious activities
        for (const exam of exams) {
          try {
          
          const logsResponse = await axiosInstance.get(
  `/api/users/cheatingLogs/${exam.examId}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

            const logs = Array.isArray(logsResponse.data) ? logsResponse.data : [];

            logs.forEach(log => {
              if (log.screenshots && log.screenshots.length > 0) {
                log.screenshots.forEach(screenshot => {
                  const screenshotTime = new Date(screenshot.detectedAt).getTime();
                  if (screenshotTime > lastNotificationTime) {
                    newSuspiciousActivities.push({
                      ...screenshot,
                      username: log.username,
                      examName: exam.examName,
                      examId: log.examId
                    });
                  }
                });
              }
            });
          } catch (error) {
            console.warn(`Failed to check logs for exam ${exam.examId}:`, error);
          }
        }

        // Sort by most recent
        newSuspiciousActivities.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));

        // Show notifications for new activities (limit to 5 to avoid spam)
        newSuspiciousActivities.slice(0, 5).forEach(activity => {
          const violationType = getViolationLabel(activity.type);
          const message = `${violationType} detected: ${activity.username} in ${activity.examName}`;
          
          toast.warn(message, {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClick: () => {
              // Open the suspicious activity page when clicked
              window.open('/suspicious-activity', '_blank');
            },
            style: {
              backgroundColor: getNotificationColor(activity.type),
              color: 'white'
            }
          });
        });

        if (newSuspiciousActivities.length > 0) {
          setLastNotificationTime(Date.now());
        }

      } catch (error) {
        console.error('Error checking for suspicious activities:', error);
        if (error.response?.status === 401) {
          console.warn('Authentication expired. User needs to login again.');
          // Don't spam with auth errors
        } else {
          console.error('Failed to check suspicious activities:', error.message);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isTeacher, lastNotificationTime]);

  const getViolationLabel = (type) => {
    switch (type) {
      case 'cellPhone':
        return '📱 Cell Phone';
      case 'multipleFace':
        return '👥 Multiple Faces';
      case 'noFace':
        return '🚫 No Face Visible';
      case 'prohibitedObject':
        return '📚 Prohibited Object';
      default:
        return '⚠️ Suspicious Activity';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'cellPhone':
        return '#d32f2f'; // Red
      case 'multipleFace':
        return '#f57c00'; // Orange
      case 'noFace':
        return '#1976d2'; // Blue
      case 'prohibitedObject':
        return '#7b1fa2'; // Purple
      default:
        return '#616161'; // Grey
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default SuspiciousActivityNotifications;