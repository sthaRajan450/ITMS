import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogDetail from "./pages/BlogDetail";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Testimonials from "./pages/Testimonials";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MyCourses from "./student/MyCourses";
import Jobs from "./pages/Jobs";
import Blogs from "./pages/Blogs";
import JobApplicationForm from "./pages/JobApplicationForm";
import MyApplications from "./student/MyApplications";
import InstrcutorDashboard from "./instructor/InstrcutorDashboard";
import StudentDashboard from "./student/StudentDashboard";
import MyCertificates from "./student/MyCertificates";
// import CourseManagement from "./instructor/CourseManagement";
import StudentManagement from "./instructor/StudentManagement";
import MyProgress from "./student/MyProgress";
import MyAssignments from "./student/MyAssignments";
import ResourceManagement from "./instructor/ResourceManagement";
import AssignmentManagement from "./instructor/AssignmentManagement";
import AdminDashboard from "./admin/AdminDashboard";

import FinancialManagement from "./admin/FinancialManagement";
import UserManagement from "./admin/UserManagement";
import EditUser from "./admin/EditUser";
import AddUser from "./admin/AddUser";
import AddCourse from "./admin/AddCourse";
import EditCourse from "./admin/EditCourse";
import EditBlog from "./admin/EditBlog";
import AddBlog from "./admin/AddBlog";
import EditJob from "./admin/EditJob";
import AddJob from "./admin/AddJob";
import Payment from "./payment/Payment";
import Cart from "./pages/Cart";
import Success from "./payment/Success";
import AddCourses from "./instructor/AddCourses";
import SendMessage from "./instructor/SendMessage";
import AssignmentList from "./pages/AssignmentList";
import SubmitAssignment from "./student/SubmitAssignment";
// import Feedbacks from "./student/Feedbacks";
import LocomotiveScroll from "locomotive-scroll";
import { ToastContainer } from "react-toastify";
import Course from "./pages/Course";
import CourseManagement from "./admin/CourseManagement";
import BlogManagement from "./admin/BlogManagement";
import JobManagement from "./admin/JobManagement";
import ApplicationManagement from "./admin/ApplicationManagement";

import InstructorCourseManagement from "./instructor/InstructorCourseManagement";

const App = () => {
  const location = useLocation();
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <About />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Contact />
              </PageWrapper>
            }
          />
          <Route
            path="/blogDetail"
            element={
              <PageWrapper>
                <BlogDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/courses"
            element={
              <PageWrapper>
                <Courses />
              </PageWrapper>
            }
          />
          <Route
            path="/courseDetail/:courseId"
            element={
              <PageWrapper>
                <CourseDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/jobs"
            element={
              <PageWrapper>
                <Jobs />
              </PageWrapper>
            }
          />
          <Route
            path="/blogs"
            element={
              <PageWrapper>
                <Blogs />
              </PageWrapper>
            }
          />
          <Route
            path="/blog/:blogId"
            element={
              <PageWrapper>
                <BlogDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/applyJob"
            element={
              <PageWrapper>
                <JobApplicationForm />
              </PageWrapper>
            }
          />
          <Route
            path="/testimonials"
            element={
              <PageWrapper>
                <Testimonials />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <PageWrapper>
                <Profile />
              </PageWrapper>
            }
          />
          <Route
            path="/payment"
            element={
              <PageWrapper>
                <Payment />
              </PageWrapper>
            }
          />
          <Route
            path="/success/:orderId"
            element={
              <PageWrapper>
                <Success />
              </PageWrapper>
            }
          />
          <Route
            path="/cart"
            element={
              <PageWrapper>
                <Cart />
              </PageWrapper>
            }
          />

          {/* Student routes */}
          <Route path="/student/" element={<StudentDashboard />}>
            <Route
              index
              element={
                <PageWrapper>
                  <MyCourses />
                </PageWrapper>
              }
            />
            <Route
              path="myCourses"
              element={
                <PageWrapper>
                  <MyCourses />
                </PageWrapper>
              }
            />
            <Route
              path="myApplications"
              element={
                <PageWrapper>
                  <MyApplications />
                </PageWrapper>
              }
            />
            <Route
              path="myCertificates"
              element={
                <PageWrapper>
                  <MyCertificates />
                </PageWrapper>
              }
            />
            <Route
              path="myProgress"
              element={
                <PageWrapper>
                  <MyProgress />
                </PageWrapper>
              }
            />
            <Route
              path="myAssignments"
              element={
                <PageWrapper>
                  <MyAssignments />
                </PageWrapper>
              }
            />
            <Route
              path="course"
              element={
                <PageWrapper>
                  <Course />
                </PageWrapper>
              }
            />
          </Route>
          <Route
            path="/assignments/:courseId"
            element={
              <PageWrapper>
                <AssignmentList />
              </PageWrapper>
            }
          />
          <Route
            path="/submitAssignment/:assignmentId"
            element={
              <PageWrapper>
                <SubmitAssignment />
              </PageWrapper>
            }
          />

          {/* Instructor routes */}
          <Route path="/instructor/" element={<InstrcutorDashboard />}>
            <Route
              index
              element={
                <PageWrapper>
                  <InstructorCourseManagement />
                </PageWrapper>
              }
            />
            <Route
              path="courseManagement"
              element={
                <PageWrapper>
                  <InstructorCourseManagement />
                </PageWrapper>
              }
            />

            <Route
              path="studentManagement"
              element={
                <PageWrapper>
                  <StudentManagement />
                </PageWrapper>
              }
            />
            <Route
              path="resourceManagement"
              element={
                <PageWrapper>
                  <ResourceManagement />
                </PageWrapper>
              }
            />
            <Route
              path="assignmentManagement"
              element={
                <PageWrapper>
                  <AssignmentManagement />
                </PageWrapper>
              }
            />
          </Route>

          <Route
            path="/sendMessage"
            element={
              <PageWrapper>
                <SendMessage />
              </PageWrapper>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/" element={<AdminDashboard />}>
            <Route
              index
              element={
                <PageWrapper>
                  <UserManagement />
                </PageWrapper>
              }
            />
            <Route
              path="userManagement"
              element={
                <PageWrapper>
                  <UserManagement />
                </PageWrapper>
              }
            />

            <Route
              path="courseManagement"
              element={
                <PageWrapper>
                  <CourseManagement />
                </PageWrapper>
              }
            />
            <Route
              path="jobManagement"
              element={
                <PageWrapper>
                  <JobManagement />
                </PageWrapper>
              }
            />
            <Route
              path="applicationManagement"
              element={
                <PageWrapper>
                  <ApplicationManagement />
                </PageWrapper>
              }
            />
            <Route
              path="blogManagement"
              element={
                <PageWrapper>
                  <BlogManagement />
                </PageWrapper>
              }
            />

            <Route
              path="financialManagement"
              element={
                <PageWrapper>
                  <FinancialManagement />
                </PageWrapper>
              }
            />
          </Route>
          <Route
            path="/updateUser/:userId"
            element={
              <PageWrapper>
                <EditUser />
              </PageWrapper>
            }
          />
          <Route
            path="/updateCourse/:courseId"
            element={
              <PageWrapper>
                <EditCourse />
              </PageWrapper>
            }
          />
          <Route
            path="/updateBlog/:blogId"
            element={
              <PageWrapper>
                <EditBlog />
              </PageWrapper>
            }
          />
          <Route
            path="/updateJob/:jobId"
            element={
              <PageWrapper>
                <EditJob />
              </PageWrapper>
            }
          />
          <Route
            path="/addUser"
            element={
              <PageWrapper>
                <AddUser />
              </PageWrapper>
            }
          />
          <Route
            path="/addCourse"
            element={
              <PageWrapper>
                <AddCourse />
              </PageWrapper>
            }
          />
          <Route
            path="/addBlog"
            element={
              <PageWrapper>
                <AddBlog />
              </PageWrapper>
            }
          />
          <Route
            path="/addJob"
            element={
              <PageWrapper>
                <AddJob />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;
