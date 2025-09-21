import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
   baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // First try to get token from localStorage
      let token = localStorage.getItem('token');
      
      // If no token found, try to get it from userInfo
      if (!token) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
            const parsedUserInfo = JSON.parse(userInfo);
            token = parsedUserInfo.token;
          } catch (e) {
            console.error('Error parsing userInfo for token:', e);
          }
        }
      }
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['User'],
  // it like a parent to other api
  // it a build in builder
  endpoints: () => ({}),
});
