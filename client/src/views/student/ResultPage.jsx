import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Code, Visibility, VisibilityOff, Search, CheckCircle } from '@mui/icons-material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axiosInstance from '../../axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ResultPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all exams first
        const examsResponse = await axiosInstance.get('/api/users/exam', {
          withCredentials: true,
        });
        setExams(examsResponse.data);

        // Fetch results based on user role
        if (userInfo?.role === 'teacher') {
          // For teachers, fetch all results
          const resultsResponse = await axiosInstance.get('/api/users/results/all', {
            withCredentials: true,
          });
          setResults(resultsResponse.data.data);
        } else {
          // For students, fetch only their visible results
          const resultsResponse = await axiosInstance.get('/api/users/results/user', {
            withCredentials: true,
          });
          setResults(resultsResponse.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleToggleVisibility = async (resultId) => {
    try {
      await axiosInstance.put(
        `/api/users/results/${resultId}/toggle-visibility`,
        {},
        {
          withCredentials: true,
        },
      );
      toast.success('Visibility updated successfully');
      // Refresh results
      const response = await axiosInstance.get('/api/users/results/all', {
        withCredentials: true,
      });
      setResults(response.data.data);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const handleViewCode = (result) => {
    setSelectedResult(result);
    setCodeDialogOpen(true);
  };

  const handleExamChange = async (examId) => {
    setSelectedExam(examId);
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/users/results/exam/${examId}`, {
        withCredentials: true,
      });
      setResults(response.data.data);
    } catch (err) {
      toast.error('Failed to fetch exam results');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || result.examId === selectedExam;
    return matchesSearch && matchesExam;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Student View
  if (userInfo?.role === 'student') {
    return (
      <PageContainer 
        title="My Exam Results" 
        description="View your exam results"
        sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}
      >
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E5E7EB',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                color: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 10px 15px -3px rgba(139, 92, 246, 0.3), 0px 4px 6px -2px rgba(139, 92, 246, 0.1)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Total Exams Taken
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700 }}>
                    {results.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E5E7EB',
                background: 'linear-gradient(135deg, #06B6D4 0%, #67E8F9 100%)',
                color: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 10px 15px -3px rgba(6, 182, 212, 0.3), 0px 4px 6px -2px rgba(6, 182, 212, 0.1)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Average Score
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700 }}>
                    {results.length > 0
                      ? `${(
                          results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length
                        ).toFixed(1)}%`
                      : '0%'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E5E7EB',
                background: 'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)',
                color: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 10px 15px -3px rgba(16, 185, 129, 0.3), 0px 4px 6px -2px rgba(16, 185, 129, 0.1)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Total Submissions
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700 }}>
                    {results.reduce((acc, curr) => acc + (curr.codingSubmissions?.length || 0), 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Results Table */}
            <Grid item xs={12}>
              <DashboardCard 
                title="My Results"
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                  }}
                >
                  <Table sx={{ '& .MuiTableCell-root': { borderColor: '#E5E7EB' } }}>
                    <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                      <TableRow>
                        <TableCell sx={{ 
                          color: '#374151', 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Exam Name
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#374151', 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          MCQ Score
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#374151', 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Coding Submissions
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#374151', 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Total Score
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#374151', 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Submission Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result._id} sx={{ 
                          backgroundColor: '#FFFFFF',
                          '&:hover': { backgroundColor: '#F9FAFB' },
                          transition: 'background-color 0.2s ease-in-out',
                        }}>
                          <TableCell sx={{ 
                            color: '#1F2937',
                            fontWeight: 500,
                          }}>
                            {result.examId?.examName || 'Exam'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${result.percentage.toFixed(1)}%`}
                              sx={{
                                backgroundColor: result.percentage >= 70 ? '#10B981' : '#EF4444',
                                color: '#ffffff',
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckCircle sx={{ color: '#10B981' }} fontSize="small" />
                              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                {result.codingSubmissions?.length || 0} submissions
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              color: '#1F2937',
                              fontWeight: 500,
                            }}>
                              Total: {result.totalMarks}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ 
                            color: '#6B7280',
                            fontWeight: 500,
                          }}>
                            {new Date(result.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {result.codingSubmissions?.length > 0 && (
                              <IconButton 
                                onClick={() => handleViewCode(result)}
                                sx={{ 
                                  color: '#8B5CF6',
                                  borderRadius: 2,
                                  '&:hover': {
                                    backgroundColor: 'rgba(139, 92, 246, 0.04)',
                                  },
                                }}
                              >
                                <Code />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DashboardCard>
            </Grid>
          </Grid>

          {/* Code Dialog */}
          <Dialog 
            open={codeDialogOpen} 
            onClose={() => setCodeDialogOpen(false)} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: '#FFFFFF',
                borderRadius: 3,
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #E5E7EB',
              },
            }}
          >
            <DialogTitle sx={{ 
              color: '#1F2937', 
              backgroundColor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              fontWeight: 600,
            }}>
              Code Submissions
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: '#FFFFFF', p: 3 }}>
              {selectedResult?.codingSubmissions?.map((submission, index) => (
                <Box key={index} mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#1F2937',
                    fontWeight: 600,
                  }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }} gutterBottom>
                    Language: {submission.language}
                  </Typography>
                  <SyntaxHighlighter language={submission.language} style={docco}>
                    {submission.code}
                  </SyntaxHighlighter>
                  <Box mt={1}>
                    <Chip 
                      icon={<CheckCircle />} 
                      label="Success" 
                      sx={{
                        backgroundColor: '#10B981',
                        color: '#ffffff',
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                    {submission.executionTime && (
                      <Chip 
                        label={`Execution Time: ${submission.executionTime}ms`} 
                        sx={{ 
                          ml: 1,
                          backgroundColor: '#F3F4F6',
                          color: '#6B7280',
                          borderRadius: 2,
                        }} 
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </DialogContent>
            <DialogActions sx={{ 
              backgroundColor: '#F9FAFB',
              borderTop: '1px solid #E5E7EB',
              p: 3,
            }}>
              <Button 
                onClick={() => setCodeDialogOpen(false)}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </PageContainer>
    );
  }

  // Teacher View
  return (
    <PageContainer title="Results Dashboard" description="View and manage exam results">
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h3">{filteredResults.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h3">
                {filteredResults.length > 0
                  ? `${(
                      filteredResults.reduce((acc, curr) => acc + curr.percentage, 0) /
                      filteredResults.length
                    ).toFixed(1)}%`
                  : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Submissions
              </Typography>
              <Typography variant="h3">
                {filteredResults.reduce(
                  (acc, curr) => acc + (curr.codingSubmissions?.length || 0),
                  0,
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Table */}
        <Grid item xs={12}>
          <DashboardCard title="Exam Results">
            {/* Exam Filter and Search */}
            <Box mb={3} display="flex" gap={2}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Exam</InputLabel>
                <Select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  label="Select Exam"
                >
                  <MenuItem value="all">All Exams</MenuItem>
                  {exams.map((exam) => (
                    <MenuItem key={exam._id} value={exam._id}>
                      {exam.examName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Search Students"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="All Results" />
              <Tab label="MCQ Results" />
              <Tab label="Coding Results" />
            </Tabs>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Exam</TableCell>
                    <TableCell>MCQ Score</TableCell>
                    <TableCell>Coding Submissions</TableCell>
                    <TableCell>Total Score</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell>{result.userId?.name}</TableCell>
                      <TableCell>{result.userId?.email}</TableCell>
                      <TableCell>
                        {exams.find((e) => e._id === result.examId)?.examName || result.examId}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${result.percentage.toFixed(1)}%`}
                          color={result.percentage >= 70 ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircle color="success" fontSize="small" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          Total: {result.totalMarks}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleToggleVisibility(result._id)}
                          color={result.showToStudent ? 'success' : 'default'}
                        >
                          {result.showToStudent ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Code View Dialog */}
      <Dialog
        open={codeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Code Submissions</DialogTitle>
        <DialogContent>
          {selectedResult?.codingSubmissions?.map((submission, index) => (
            <Box key={index} mb={3}>
              <Typography variant="h6" gutterBottom>
                Question {index + 1}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Language: {submission.language}
              </Typography>
              <SyntaxHighlighter language={submission.language} style={docco}>
                {submission.code}
              </SyntaxHighlighter>
              <Box mt={1}>
                <Chip icon={<CheckCircle />} label="Success" color="success" />
                {submission.executionTime && (
                  <Chip label={`Execution Time: ${submission.executionTime}ms`} sx={{ ml: 1 }} />
                )}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ResultPage;
