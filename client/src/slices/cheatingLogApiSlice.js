import { apiSlice } from './apiSlice';

// Define the base URL for the cheating logs API (mounted under /api/users)
const CHEATING_LOGS_URL = '/api/users/cheatingLogs';

// Inject endpoints for the cheating log slice
export const cheatingLogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get cheating logs for a specific exam
    getCheatingLogs: builder.query({
      query: (examId) => ({
        url: `${CHEATING_LOGS_URL}/${examId}`,
        method: 'GET',
      }),
    }),
    // Save a new cheating log entry for an exam
    saveCheatingLog: builder.mutation({
      query: (data) => ({
        url: `${CHEATING_LOGS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    // Get all cheating logs across all exams (for dashboard)
    getAllCheatingLogs: builder.query({
      query: () => ({
        url: `${CHEATING_LOGS_URL}/all`,
        method: 'GET',
      }),
    }),
  }),
});

// Export the generated hooks for each endpoint
export const { 
  useGetCheatingLogsQuery, 
  useSaveCheatingLogMutation,
  useGetAllCheatingLogsQuery 
} = cheatingLogApiSlice;
