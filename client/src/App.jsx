import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import BlogDetail from "./pages/BlogDetail";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Testimonials from "./pages/Testimonials";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/profile";
import LocomotiveScroll from "locomotive-scroll";
import Footer from "./components/Footer";
import MyCourses from "./student/MyCourses";
import Jobs from "./pages/Jobs";
import Blogs from "./pages/Blogs";

import JobApplicationForm from "./pages/JobApplicationForm";
import MyApplications from "./student/MyApplications";
import InstrcutorDashboard from "./instructor/InstrcutorDashboard";
import StudentDashboard from "./student/StudentDashboard";
import MyCertificates from "./student/MyCertificates";
import CourseManagement from "./instructor/CourseManagement";
import StudentManagement from "./instructor/StudentManagement";
import MyProgress from "./student/MyProgress";
import MyAssignments from "./student/MyAssignments";
import ResourceManagement from "./instructor/ResourceManagement";
import AssignmentManagement from "./instructor/AssignmentManagement";
import AdminDashboard from "./admin/AdminDashboard";
import ContentManagement from "./admin/ContentManagement";
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

const App = () => {
  const locomotiveScroll = new LocomotiveScroll();
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogDetail" element={<BlogDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courseDetail/:courseId" element={<CourseDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
        <Route path="/job/:jobId" element={<JobApplicationForm />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success/:orderId" element={<Success />} />
        <Route path="/cart" element={<Cart />} />
        //student routes
        <Route path="/student/" element={<StudentDashboard />}>
          <Route index element={<MyCourses />} />
          <Route path="myCourses" element={<MyCourses />} />
          <Route path="myApplications" element={<MyApplications />} />
          <Route path="myCertificates" element={<MyCertificates />} />
          <Route path="myProgress" element={<MyProgress />} />
          <Route path="myAssignments" element={<MyAssignments />} />
        </Route>
        <Route path="/assignments/:courseId" element={<AssignmentList />} />
        <Route
          path="/submitAssignment/:assignmentId"
          element={<SubmitAssignment />}
        />
        //instructor routes
        <Route path="/instructor/" element={<InstrcutorDashboard />}>
          <Route index element={<CourseManagement />} />
          <Route path="courseManagement" element={<CourseManagement />} />
          <Route path="studentManagement" element={<StudentManagement />} />
          <Route
            path="resourceManagement/:courseId"
            element={<ResourceManagement />}
          />
          <Route
            path="assignmentManagement/:courseId"
            element={<AssignmentManagement />}
          />
        </Route>
        <Route path="/addCourses" element={<AddCourses />} />
        <Route path="/sendMessage" element={<SendMessage />} />
        //admin routes
        <Route path="/admin/" element={<AdminDashboard />}>
          <Route index element={<UserManagement />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="contentManagement" element={<ContentManagement />} />
          <Route path="financialManagement" element={<FinancialManagement />} />
        </Route>
        <Route path="/updateUser/:userId" element={<EditUser />} />
        <Route path="/updateCourse/:courseId" element={<EditCourse />} />
        <Route path="/updateBlog/:blogId" element={<EditBlog />} />
        <Route path="/updateJob/:jobId" element={<EditJob />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/addBlog" element={<AddBlog />} />
        <Route path="/addJob" element={<AddJob />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
