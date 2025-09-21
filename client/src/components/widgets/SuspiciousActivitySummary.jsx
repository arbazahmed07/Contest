import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Warning,
  Visibility,
  Security,
  CameraAlt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import { useGetExamsQuery } from '../../slices/examApiSlice';

const SuspiciousActivitySummary = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [totalViolations, setTotalViolations] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { data: examsData } = useGetExamsQuery();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!examsData) return;
      
      setLoading(true);
      try {
        const allScreenshots = [];
        let violationCount = 0;

        for (const exam of examsData) {
          try {
            const response = await axiosInstance.get(`/api/users/cheatingLogs/${exam.examId}`);
            const logs = Array.isArray(response.data) ? response.data : [];
            
            logs.forEach(log => {
              violationCount += (log.cellPhoneCount || 0) + (log.multipleFaceCount || 0) + 
                              (log.noFaceCount || 0) + (log.prohibitedObjectCount || 0);

              if (log.screenshots && log.screenshots.length > 0) {
                log.screenshots.forEach(screenshot => {
                  allScreenshots.push({
                    ...screenshot,
                    username: log.username,
                    examName: exam.examName,
                  });
                });
              }
            });
          } catch (error) {
            console.warn(`Failed to fetch logs for exam ${exam.examId}:`, error);
          }
        }

        // Sort by most recent and take top 3
        allScreenshots.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
        setRecentActivity(allScreenshots.slice(0, 3));
        setTotalViolations(violationCount);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [examsData]);

  const getViolationColor = (type) => {
    switch (type) {
      case 'cellPhone': return 'error';
      case 'multipleFace': return 'warning';
      case 'noFace': return 'info';
      case 'prohibitedObject': return 'secondary';
      default: return 'default';
    }
  };

  const getViolationLabel = (type) => {
    switch (type) {
      case 'cellPhone': return 'Cell Phone';
      case 'multipleFace': return 'Multiple Faces';
      case 'noFace': return 'No Face';
      case 'prohibitedObject': return 'Prohibited Object';
      default: return 'Unknown';
    }
  };

  const getViolationIcon = (type) => {
    switch (type) {
      case 'cellPhone': return '📱';
      case 'multipleFace': return '👥';
      case 'noFace': return '🚫';
      case 'prohibitedObject': return '📚';
      default: return '⚠️';
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Suspicious Activity
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/suspicious-activity')}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" gutterBottom>
            Recent Suspicious Activity
          </Typography>
          <Tooltip title="View All">
            <IconButton color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
        </Stack>

        {recentActivity.length === 0 ? (
          <Box textAlign="center" py={3}>
            <Security sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No suspicious activity detected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All exams are running smoothly
            </Typography>
          </Box>
        ) : (
          <>
            <Box mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Warning color="error" />
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {totalViolations} total violations detected
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={2}>
              {recentActivity.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <Avatar
                    src={activity.url}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: `2px solid`,
                      borderColor: `${getViolationColor(activity.type)}.main`
                    }}
                  >
                    <CameraAlt />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {activity.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {activity.examName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.detectedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={getViolationIcon(activity.type)}
                    color={getViolationColor(activity.type)}
                    size="small"
                    title={getViolationLabel(activity.type)}
                  />
                </Box>
              ))}
            </Stack>

            <Box mt={2} textAlign="center">
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                Click to view all suspicious activities →
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspiciousActivitySummary;