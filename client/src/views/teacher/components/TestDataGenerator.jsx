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
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from '../../../slices/cheatingLogApiSlice';
import { toast } from 'react-toastify';

const TestDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { data: examsData } = useGetExamsQuery();
  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();

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
    if (!examsData || examsData.length === 0) {
      toast.error('No exams found to generate test data for');
      return;
    }

    setIsGenerating(true);
    try {
      const firstExam = examsData[0];
      toast.info(`Generating test data for exam: ${firstExam.examName}`);
      
      // Generate multiple test logs with different students
      const testStudents = [
        { name: 'nlkdlknl', email: 'onononnjkn@mail.com' },
        { name: 'Mohammad Arbaz', email: 'mdarbazking7@gmail.com' },
        { name: 'Test Student', email: 'test@example.com' },
      ];

      for (let i = 0; i < testStudents.length; i++) {
        const student = testStudents[i];
        const screenshotsForStudent = sampleScreenshots.slice(0, Math.floor(Math.random() * 3) + 1);
        
        const testData = {
          examId: firstExam.examId,
          username: student.name,
          email: student.email,
          noFaceCount: Math.floor(Math.random() * 3) + 1,
          multipleFaceCount: Math.floor(Math.random() * 2) + 1,
          cellPhoneCount: Math.floor(Math.random() * 2) + 1,
          prohibitedObjectCount: Math.floor(Math.random() * 2),
          screenshots: screenshotsForStudent
        };

        console.log(`Creating test data for ${student.name}:`, testData);
        console.log(`Screenshots for ${student.name}:`, screenshotsForStudent);
        
        // Use Redux RTK Query mutation instead of direct axios call
        const result = await saveCheatingLogMutation(testData).unwrap();
        console.log(`✅ Successfully created test data for ${student.name}:`, result);
        toast.success(`Created test data for ${student.name} with ${screenshotsForStudent.length} screenshots`);
      }

      toast.success('All test data generated successfully!');
      // Refresh the page to show new data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error generating test data:', error);
      if (error?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error?.data?.message) {
        toast.error(`Failed to generate test data: ${error.data.message}`);
      } else {
        toast.error('Failed to generate test data. Please try again.');
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