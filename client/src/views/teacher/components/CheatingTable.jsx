import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import { useGetCheatingLogsQuery } from '../../../slices/cheatingLogApiSlice';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import WarningIcon from '@mui/icons-material/Warning';

export default function CheatingTable() {
  const [filter, setFilter] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [cheatingLogs, setCheatingLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: examsData, isLoading: examsLoading, error: examsError } = useGetExamsQuery();
  const {
    data: cheatingLogsData,
    isLoading: logsLoading,
    error: logsError,
  } = useGetCheatingLogsQuery(selectedExamId, {
    skip: !selectedExamId,
  });

  // Debug logging
  console.log('ExamsData:', examsData);
  console.log('ExamsLoading:', examsLoading);
  console.log('ExamsError:', examsError);
  console.log('SelectedExamId:', selectedExamId);
  console.log('CheatingLogsData:', cheatingLogsData);
  console.log('LogsLoading:', logsLoading);
  console.log('LogsError:', logsError);

  useEffect(() => {
    if (examsData && examsData.length > 0) {
      const firstExam = examsData[0];
      setSelectedExamId(firstExam.examId);
    }
  }, [examsData]);

  useEffect(() => {
    if (cheatingLogsData) {
      setCheatingLogs(Array.isArray(cheatingLogsData) ? cheatingLogsData : []);
    }
  }, [cheatingLogsData]);

  const filteredUsers = cheatingLogs.filter(
    (log) =>
      log.username?.toLowerCase().includes(filter.toLowerCase()) ||
      log.email?.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleViewScreenshots = (log) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const getViolationColor = (count) => {
    if (count > 5) return 'error';
    if (count > 2) return 'warning';
    return 'success';
  };

  const getViolationIcon = (count) => {
    if (count > 5) return <WarningIcon color="error" />;
    if (count > 2) return <WarningIcon color="warning" />;
    return null;
  };

  if (examsLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: '#8B5CF6' }} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Loading exams...
        </Typography>
      </Box>
    );
  }

  if (examsError) {
    return (
      <Box p={2}>
        <Typography color="error" variant="h6" gutterBottom>
          Error loading exams
        </Typography>
        <Typography color="error" variant="body2">
          {examsError.data?.message || examsError.error || 'Unknown error occurred'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please check your internet connection and try again.
        </Typography>
      </Box>
    );
  }

  if (!examsData || examsData.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Exams Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please create an exam first to view monitoring logs.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Select
              label="Select Exam"
              value={selectedExamId || ''}
              onChange={(e) => setSelectedExamId(e.target.value)}
              fullWidth
            >
              {examsData.map((exam) => (
                <MenuItem key={exam.examId} value={exam.examId}>
                  {exam.examName || 'Unnamed Exam'}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Filter by Name or Email"
              variant="outlined"
              fullWidth
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {logsLoading ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress sx={{ color: '#8B5CF6' }} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Loading cheating logs for selected exam...
          </Typography>
        </Box>
      ) : logsError ? (
        <Box p={2}>
          <Typography color="error" variant="h6" gutterBottom>
            Error loading logs
          </Typography>
          <Typography color="error" variant="body2">
            {logsError.data?.message || logsError.error || 'Unknown error occurred'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please try selecting a different exam or refresh the page.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sno</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>No Face Count</TableCell>
                <TableCell>Multiple Face Count</TableCell>
                <TableCell>Cell Phone Count</TableCell>
                <TableCell>Prohibited Object Count</TableCell>
                <TableCell>Screenshots</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No cheating logs found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {filter 
                          ? `No logs match your search "${filter}"`
                          : `No monitoring data available for "${examsData.find(exam => exam.examId === selectedExamId)?.examName || 'this exam'}"`
                        }
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{log.username}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.noFaceCount)}
                        label={log.noFaceCount}
                        color={getViolationColor(log.noFaceCount)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.multipleFaceCount)}
                        label={log.multipleFaceCount}
                        color={getViolationColor(log.multipleFaceCount)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.cellPhoneCount)}
                        label={log.cellPhoneCount}
                        color={getViolationColor(log.cellPhoneCount)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.prohibitedObjectCount)}
                        label={log.prohibitedObjectCount}
                        color={getViolationColor(log.prohibitedObjectCount)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Screenshots">
                        <IconButton
                          onClick={() => handleViewScreenshots(log)}
                          disabled={!log.screenshots?.length}
                        >
                          <ImageIcon color={log.screenshots?.length ? 'primary' : 'disabled'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Screenshots Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Screenshots - {selectedLog?.username}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedLog?.screenshots?.map((screenshot, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={screenshot.url}
                    alt={`Violation - ${screenshot.type}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type: {screenshot.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Detected: {new Date(screenshot.detectedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
