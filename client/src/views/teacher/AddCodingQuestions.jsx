import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IconChecklist } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import AddCodingQuestionForm from './components/AddCodingQuestionForm';

const AddCodingQuestions = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title="Add Coding Questions" description="Create programming challenges for exams">
      <DashboardCard 
        title="Programming Questions"
        sx={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid #E5E7EB',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Create coding challenges and programming problems for your students to solve during exams.
          </Typography>
          
          {/* Navigation to MCQ Questions */}
          <Paper sx={{ p: 2, backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconChecklist size={24} color="#22C55E" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#14532D' }}>
                    Need to add multiple choice questions?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create MCQ questions with multiple options for your exams.
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<IconChecklist size={16} />}
                onClick={() => navigate('/add-questions')}
                sx={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  },
                }}
              >
                Add MCQ Questions
              </Button>
            </Box>
          </Paper>
        </Box>
        
        <AddCodingQuestionForm />
      </DashboardCard>
    </PageContainer>
  );
};

export default AddCodingQuestions;