import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Warning,
  Phone,
  Face,
  Book,
  Visibility,
  Timeline,
  Security,
  CameraAlt,
} from '@mui/icons-material';
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import { useGetAllCheatingLogsQuery } from '../../../slices/cheatingLogApiSlice';

const SuspiciousActivityDashboard = () => {
  const { data: examsData, isLoading: examsLoading } = useGetExamsQuery();
  const { data: allLogsData, isLoading: logsLoading } = useGetAllCheatingLogsQuery();
  
  // State for processed data
  const [recentScreenshots, setRecentScreenshots] = useState([]);
  const [violationStats, setViolationStats] = useState({});

  // Process the fetched data
  useEffect(() => {
    if (logsLoading || !allLogsData || !examsData) return;

    const logs = Array.isArray(allLogsData) ? allLogsData : [];
    const combinedScreenshots = [];
    const stats = {
      cellPhone: 0,
      multipleFace: 0,
      noFace: 0,
      prohibitedObject: 0,
      totalScreenshots: 0,
      totalViolations: 0,
    };

    // Process all logs
    logs.forEach(log => {
      // Find exam name
      const exam = examsData.find(e => e.examId === log.examId);
      const examName = exam?.examName || 'Unknown Exam';

      // Count violations
      stats.cellPhone += log.cellPhoneCount || 0;
      stats.multipleFace += log.multipleFaceCount || 0;
      stats.noFace += log.noFaceCount || 0;
      stats.prohibitedObject += log.prohibitedObjectCount || 0;
      stats.totalViolations += (log.cellPhoneCount || 0) + (log.multipleFaceCount || 0) + 
                             (log.noFaceCount || 0) + (log.prohibitedObjectCount || 0);

      // Collect screenshots
      if (log.screenshots && log.screenshots.length > 0) {
        log.screenshots.forEach(screenshot => {
          combinedScreenshots.push({
            ...screenshot,
            username: log.username,
            email: log.email,
            examName: examName,
            examId: log.examId
          });
        });
      }
    });

    stats.totalScreenshots = combinedScreenshots.length;
    
    // Sort screenshots by most recent
    combinedScreenshots.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));

    setRecentScreenshots(combinedScreenshots.slice(0, 12)); // Show latest 12
    setViolationStats(stats);

  }, [allLogsData, examsData, logsLoading]);

  const getViolationColor = (type) => {
    switch (type) {
      case 'cellPhone':
        return 'error';
      case 'multipleFace':
        return 'warning';
      case 'noFace':
        return 'info';
      case 'prohibitedObject':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getViolationLabel = (type) => {
    switch (type) {
      case 'cellPhone':
        return 'Cell Phone';
      case 'multipleFace':
        return 'Multiple Faces';
      case 'noFace':
        return 'No Face';
      case 'prohibitedObject':
        return 'Prohibited Object';
      default:
        return 'Unknown';
    }
  };

  if (examsLoading || logsLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <LinearProgress sx={{ width: '100%', mb: 2 }} />
        <Typography>Loading suspicious activity data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
    
      
      {/* Statistics Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff1744 0%, #ff5252 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {violationStats.totalViolations}
                  </Typography>
                  <Typography variant="body2">Total Violations</Typography>
                </Box>
                <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {violationStats.totalScreenshots}
                  </Typography>
                  <Typography variant="body2">Evidence Captured</Typography>
                </Box>
                <CameraAlt sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {Array.isArray(allLogsData) ? allLogsData.length : 0}
                  </Typography>
                  <Typography variant="body2">Students Monitored</Typography>
                </Box>
                <Timeline sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {examsData?.length || 0}
                  </Typography>
                  <Typography variant="body2">Active Exams</Typography>
                </Box>
                <Security sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Violation Type Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Violation Breakdown
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone color="error" />
              <Box>
                <Typography variant="h6">{violationStats.cellPhone}</Typography>
                <Typography variant="caption">Cell Phone</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Face color="warning" />
              <Box>
                <Typography variant="h6">{violationStats.multipleFace}</Typography>
                <Typography variant="caption">Multiple Faces</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Warning color="info" />
              <Box>
                <Typography variant="h6">{violationStats.noFace}</Typography>
                <Typography variant="caption">No Face Visible</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Book color="secondary" />
              <Box>
                <Typography variant="h6">{violationStats.prohibitedObject}</Typography>
                <Typography variant="caption">Prohibited Objects</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Suspicious Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Suspicious Activity Evidence
        </Typography>
        
        {recentScreenshots.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No suspicious activity detected yet. The system is actively monitoring all active exams.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Showing the most recent {recentScreenshots.length} suspicious activities detected across all exams
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {recentScreenshots.map((screenshot, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: `2px solid`,
                      borderColor: `${getViolationColor(screenshot.type)}.main`,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="150"
                        image={screenshot.url}
                        alt={`${getViolationLabel(screenshot.type)} - Evidence`}
                        sx={{ 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(screenshot.url, '_blank')}
                      />
                      <Chip
                        label={getViolationLabel(screenshot.type)}
                        color={getViolationColor(screenshot.type)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold'
                        }}
                      />
                      <Tooltip title="View full size">
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                          }}
                          onClick={() => window.open(screenshot.url, '_blank')}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {screenshot.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {screenshot.examName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(screenshot.detectedAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SuspiciousActivityDashboard;