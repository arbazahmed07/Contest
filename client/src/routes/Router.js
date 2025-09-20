import React, { lazy } from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const ExamLayout = Loadable(lazy(() => import('../layouts/full/ExamLayout')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Success = Loadable(lazy(() => import('../views/Success')));

const TestPage = Loadable(lazy(() => import('../views/student/TestPage')));
const ExamPage = Loadable(lazy(() => import('../views/student/ExamPage')));
const ExamDetails = Loadable(lazy(() => import('../views/student/ExamDetails')));
const CodeDetails = Loadable(lazy(() => import('../views/student/CodeDetails')));
const ResultPage = Loadable(lazy(() => import('../views/student/ResultPage')));
const Coder = Loadable(lazy(() => import('../views/student/Coder')));

const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserAccount = Loadable(lazy(() => import('../views/authentication/UserAccount')));

const CreateExamPage = Loadable(lazy(() => import('../views/teacher/CreateExamPage')));
const ExamLogPage = Loadable(lazy(() => import('../views/teacher/ExamLogPage')));
const AddQuestions = Loadable(lazy(() => import('../views/teacher/AddQuestions')));
const PrivateRoute = Loadable(lazy(() => import("../views/authentication/PrivateRoute")));
const TeacherRoute = Loadable(lazy(() => import("../views/authentication/TeacherRoute")));

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<FullLayout />}>
          <Route index={true} path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" exact={true} element={<ExamPage />} />
          <Route path="/sample-page" exact={true} element={<SamplePage />} />
          <Route path="/Success" exact={true} element={<Success />} />
          <Route path="/exam" exact={true} element={<ExamPage />} />
          <Route path="/result" exact={true} element={<ResultPage />} />
          <Route path="" element={<TeacherRoute />}>
            <Route path="/create-exam" exact={true} element={<CreateExamPage />} />
            <Route path="/add-questions" exact={true} element={<AddQuestions />} />
            <Route path="/exam-log" exact={true} element={<ExamLogPage />} />
          </Route>/
        </Route>
        <Route path="/" element={<ExamLayout />}>
          <Route path="exam/:examId" exact={true} element={<ExamDetails />} />
          <Route path="exam/:examId/codedetails" exact={true} element={<CodeDetails />} />
          <Route path="exam/:examId/:testId" exact={true} element={<TestPage />} />
          <Route path="exam/:examId/code" exact={true} element={<Coder />} />
        </Route>
      </Route>
      <Route path="/user" element={<FullLayout />}>
        <Route path="account" exact={true} element={<UserAccount />} />
      </Route>
      <Route path="/auth" element={<BlankLayout />}>
        <Route path="404" element={<Error />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>
    </>,
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default Router;
