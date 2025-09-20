import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { uniqueId } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetQuestionsQuery, useGetExamQuery } from '../../slices/examApiSlice';
import { Box } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const DescriptionAndInstructions = () => {
  const navigate = useNavigate();

  const { examId } = useParams();
  const { data: questions, isLoading: questionsLoading } = useGetQuestionsQuery(examId); // Fetch questions using examId
  const { data: exam, isLoading: examLoading } = useGetExamQuery(examId); // Fetch exam details
  
  // fech exam data from backend
  // pass testUnique id on start button
  const testId = uniqueId();
  // accetp
  const [certify, setCertify] = useState(false);
  const handleCertifyChange = () => {
    setCertify(!certify);
  };
  const handleTest = () => {
    // Check if the test date is valid here
    const isValid = true; // Replace with your date validation logic
    console.log('Test link');
    if (isValid) {
      // Replace 'examid' and 'TestId' with the actual values
      navigate(`/exam/${examId}/${testId}`);
    } else {
      // Display an error message or handle invalid date
      toast.error('Test date is not valid.');
    }
  };

  if (examLoading) {
    return (
      <Card sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading exam details...</Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100vh',
        backgroundColor: '#FFFFFF',
        border: 'none',
        borderRadius: 0,
      }}
    >
      <CardContent sx={{ padding: '40px', backgroundColor: '#FFFFFF' }}>
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 3,
            }}
          >
            {exam?.examName || 'Exam Instructions'}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#1F2937',
              borderBottom: '2px solid #8B5CF6',
              paddingBottom: 1,
              fontWeight: 600,
            }}
          >
            Instructions:
          </Typography>

          <List sx={{ color: '#6B7280' }}>
            <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  There is <strong style={{ color: '#1F2937' }}>Negative Marking</strong> for wrong answers.
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  <strong style={{ color: '#EF4444' }}>Do Not switch tabs</strong> while taking the test.
                  <strong style={{ color: '#EF4444' }}> Switching Tabs will Block / End the test automatically.</strong>
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  The test will only run in <strong style={{ color: '#1F2937' }}>full screen mode.</strong> Do not switch back
                  to tab mode. Test will end automatically.
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  You may need to use blank sheets for rough work. Please arrange for blank sheets
                  before starting.
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Clicking on Back or Next will save the answer.
                </Typography>
              </ListItemText>
            </ListItem>
          </List>

          <FormControlLabel
            control={
              <Checkbox
                checked={certify}
                onChange={handleCertifyChange}
                sx={{
                  color: '#8B5CF6',
                  '&.Mui-checked': {
                    color: '#8B5CF6',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: '#6B7280' }}>
                I certify that I have carefully read and agree to all of the instructions mentioned above
              </Typography>
            }
          />

          <Box sx={{ display: 'flex', padding: '2px', margin: '10px' }}>
            <Button
              variant="contained"
              disabled={!certify}
              onClick={handleTest}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                borderRadius: 2,
                py: 1.5,
                px: 4,
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 25px rgba(139, 92, 246, 0.4)',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              Start Test
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DescriptionAndInstructions;
