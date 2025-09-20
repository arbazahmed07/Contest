import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import CheatingTable from './components/CheatingTable';

const ExamLogPage = () => {
  return (
    <PageContainer title="Exam Logs" description="View cheating detection logs for all exams">
      <DashboardCard 
        title="Exam Monitoring Logs"
        sx={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid #E5E7EB',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Monitor student behavior and detect potential cheating incidents during exams.
          </Typography>
        </Box>
        <CheatingTable />
      </DashboardCard>
    </PageContainer>
  );
};

export default ExamLogPage;
