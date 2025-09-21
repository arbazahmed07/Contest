import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import SuspiciousActivityDashboard from './components/SuspiciousActivityDashboard';

const SuspiciousActivityPage = () => {
  return (
    <PageContainer title="Suspicious Activity Monitor" description="Monitor suspicious activities and violations across all exams">
      <DashboardCard 
        title="Suspicious Activity Dashboard"
        sx={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid #E5E7EB',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring of suspicious activities, violations, and evidence captured during exams.
          </Typography>
        </Box>
        <SuspiciousActivityDashboard />
      </DashboardCard>
    </PageContainer>
  );
};

export default SuspiciousActivityPage;