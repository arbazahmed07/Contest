import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import axiosInstance from '../../../axios';

const validationSchema = yup.object({
  examId: yup.string().required('Please select an exam'),
  question: yup.string().required('Question title is required').min(10, 'Question should be at least 10 characters'),
  description: yup.string().required('Question description is required').min(20, 'Description should be at least 20 characters'),
});

const AddCodingQuestionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: examsData, isLoading: examsLoading, error: examsError } = useGetExamsQuery();

  const formik = useFormik({
    initialValues: {
      examId: '',
      question: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleSubmit(values, resetForm);
    },
  });

  // Set the first exam as default when exams are loaded
  useEffect(() => {
    if (examsData && examsData.length > 0 && !formik.values.examId) {
      formik.setFieldValue('examId', examsData[0].examId);
    }
  }, [examsData, formik.values.examId, formik]);

  const handleSubmit = async (values, resetForm) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/coding/questions', {
        question: values.question,
        description: values.description,
        examId: values.examId,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Coding question added successfully!');
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to add coding question');
      }
    } catch (error) {
      console.error('Error adding coding question:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to add coding question';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (examsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: '#8B5CF6' }} />
        <Typography sx={{ ml: 2 }}>Loading exams...</Typography>
      </Box>
    );
  }

  if (examsError) {
    return (
      <Alert severity="error">
        Error loading exams: {examsError.data?.message || examsError.error || 'Unknown error'}
      </Alert>
    );
  }

  if (!examsData || examsData.length === 0) {
    return (
      <Alert severity="info">
        No exams available. Please create an exam first before adding coding questions.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1F2937', fontWeight: 600 }}>
          Add Coding Question
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create programming challenges for your students to solve during exams.
        </Typography>

        <Stack spacing={3}>
          {/* Exam Selection */}
          <FormControl fullWidth>
            <InputLabel>Select Exam</InputLabel>
            <Select
              name="examId"
              label="Select Exam"
              value={formik.values.examId}
              onChange={formik.handleChange}
              error={formik.touched.examId && Boolean(formik.errors.examId)}
            >
              {examsData.map((exam) => (
                <MenuItem key={exam.examId} value={exam.examId}>
                  {exam.examName}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.examId && formik.errors.examId && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {formik.errors.examId}
              </Typography>
            )}
          </FormControl>

          <Divider />

          {/* Question Title */}
          <TextField
            fullWidth
            name="question"
            label="Question Title"
            placeholder="e.g., Implement a Binary Search Algorithm"
            value={formik.values.question}
            onChange={formik.handleChange}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
            multiline
            rows={2}
          />

          {/* Question Description */}
          <TextField
            fullWidth
            name="description"
            label="Question Description & Requirements"
            placeholder="Provide detailed instructions, input/output format, constraints, examples, etc."
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            multiline
            rows={8}
          />

          {/* Example Template */}
          <Paper sx={{ p: 2, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#374151' }}>
              💡 Example Description Format:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
{`Write a function to implement binary search on a sorted array.

Input:
- Array: [1, 3, 5, 7, 9, 11]
- Target: 7

Output:
- Return the index of the target (3 in this case)
- Return -1 if not found

Constraints:
- Array size: 1 <= n <= 10^6
- Time complexity should be O(log n)

Example:
binarySearch([1, 3, 5, 7, 9, 11], 7) → 3
binarySearch([1, 3, 5, 7, 9, 11], 4) → -1`}
            </Typography>
          </Paper>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => formik.resetForm()}
              disabled={isSubmitting}
              sx={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
                '&:hover': {
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139, 92, 246, 0.04)',
                },
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !formik.isValid}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                borderRadius: 2,
                py: 1.5,
                px: 4,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0px 4px 15px rgba(139, 92, 246, 0.4)',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                  Adding Question...
                </>
              ) : (
                'Add Coding Question'
              )}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddCodingQuestionForm;