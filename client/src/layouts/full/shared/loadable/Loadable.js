import React, { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

const Loadable = (Component) => (props) =>
(
  <Suspense fallback={
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  }>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
