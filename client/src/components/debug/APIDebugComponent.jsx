import React from 'react';
import { useGetAllCheatingLogsQuery } from '../../slices/cheatingLogApiSlice';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const APIDebugComponent = () => {
  const { data: allLogsData, isLoading, error } = useGetAllCheatingLogsQuery();

  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f0f0f0' }}>
      <Typography variant="h6" gutterBottom>
        🐛 API Debug Info
      </Typography>
      
      {isLoading && (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography>Loading cheating logs...</Typography>
        </Box>
      )}
      
      {error && (
        <Typography color="error">
          ❌ Error: {error.status} - {error.data?.message || error.message}
        </Typography>
      )}
      
      {allLogsData && (
        <Box>
          <Typography variant="body2">
            📊 Total logs fetched: {Array.isArray(allLogsData) ? allLogsData.length : 'Not an array'}
          </Typography>
          
          {Array.isArray(allLogsData) && allLogsData.map((log, index) => (
            <Box key={log._id || index} sx={{ mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
              <Typography variant="caption">
                👤 {log.username} | 📧 {log.email} | 🎯 Exam: {log.examId}
              </Typography>
              <br />
              <Typography variant="caption">
                📸 Screenshots: {log.screenshots?.length || 0} | 
                🚨 Violations: Cell({log.cellPhoneCount || 0}) Multi({log.multipleFaceCount || 0}) No({log.noFaceCount || 0}) Obj({log.prohibitedObjectCount || 0})
              </Typography>
              {log.screenshots && log.screenshots.length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="success.main">
                    ✅ Screenshots found:
                  </Typography>
                  {log.screenshots.map((screenshot, idx) => (
                    <Typography key={idx} variant="caption" display="block" sx={{ ml: 1 }}>
                      • {screenshot.type} - {screenshot.url?.substring(0, 50)}...
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default APIDebugComponent;