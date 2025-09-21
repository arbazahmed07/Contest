import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  BugReport,
  AddPhotoAlternate,
  Delete,
} from '@mui/icons-material';
import axiosInstance from '../../../axios';
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import { toast } from 'react-toastify';

const TestDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { data: examsData } = useGetExamsQuery();

  const sampleScreenshots = [
    {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      type: 'cellPhone',
      detectedAt: new Date().toISOString()
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      type: 'multipleFace',
      detectedAt: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
    },
    {
      url: 'https://images.unsplash.com/photo-1494790108755-2616b332b75e?w=400',
      type: 'noFace',
      detectedAt: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
    },
    {
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      type: 'prohibitedObject',
      detectedAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
    }
  ];

  const generateTestData = async () => {
    // Debug authentication - check multiple sources for token
    let token = localStorage.getItem('token');
    
    if (!token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          token = parsedUserInfo.token;
        } catch (e) {
          console.error('Error parsing userInfo for token:', e);
        }
      }
    }
    
    console.log('Current token:', token ? 'Token exists' : 'No token found');
    
    if (!examsData || examsData.length === 0) {
      toast.error('No exams found to generate test data for');
      return;
    }

    if (!token) {
      toast.error('No authentication token found. Please login again.');
      return;
    }

    setIsGenerating(true);
    try {
      const firstExam = examsData[0];
      toast.info(`Generating test data for exam: ${firstExam.examName}`);
      
      // Generate multiple test logs with different students
      const testStudents = [
        { name: 'John Doe', email: 'john@test.com' },
        { name: 'Jane Smith', email: 'jane@test.com' },
        { name: 'Bob Wilson', email: 'bob@test.com' },
      ];

      for (let i = 0; i < testStudents.length; i++) {
        const student = testStudents[i];
        const screenshotsForStudent = sampleScreenshots.slice(0, Math.floor(Math.random() * 3) + 1);
        
        const testData = {
          examId: firstExam.examId,
          username: student.name,
          email: student.email,
          noFaceCount: Math.floor(Math.random() * 3),
          multipleFaceCount: Math.floor(Math.random() * 2),
          cellPhoneCount: Math.floor(Math.random() * 2),
          prohibitedObjectCount: Math.floor(Math.random() * 2),
          screenshots: screenshotsForStudent
        };

        console.log(`Creating test data for ${student.name}:`, testData);
        await axiosInstance.post('/api/users/cheatingLogs', testData);
        console.log(`✅ Successfully created test data for ${student.name}`);
        toast.success(`Created test data for ${student.name}`);
      }

      toast.success('All test data generated successfully!');
      // Refresh the page to show new data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error generating test data:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.data?.message) {
        toast.error(`Failed to generate test data: ${error.response.data.message}`);
      } else {
        toast.error('Failed to generate test data. Check console for details.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const clearTestData = async () => {
    if (!examsData || examsData.length === 0) {
      toast.error('No exams found');
      return;
    }

    setIsClearing(true);
    try {
      // Note: This would require a backend endpoint to clear data
      // For now, we'll just show a message
      toast.info('Clear functionality would require a backend endpoint to delete test data');
    } catch (error) {
      console.error('Error clearing test data:', error);
      toast.error('Failed to clear test data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card sx={{ mb: 3, border: '2px dashed', borderColor: 'warning.main' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <BugReport color="warning" />
          <Typography variant="h6" color="warning.main">
            Test Data Generator
          </Typography>
        </Stack>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          This is a development tool to generate sample suspicious activity data for testing the dashboard.
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isGenerating ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
              onClick={generateTestData}
              disabled={isGenerating || !examsData?.length}
              fullWidth
            >
              {isGenerating ? 'Generating...' : 'Generate Test Data'}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="error"
              startIcon={isClearing ? <CircularProgress size={20} /> : <Delete />}
              onClick={clearTestData}
              disabled={isClearing}
              fullWidth
            >
              {isClearing ? 'Clearing...' : 'Clear Test Data'}
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          • Generates sample violations for the first exam in your list<br/>
          • Creates screenshots with different violation types<br/>
          • Adds multiple students with varying violation counts
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestDataGenerator;