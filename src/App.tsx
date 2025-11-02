import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import UserManagement from "./pages/admin/UserManagement";
import GradingSystem from "./pages/admin/GradingSystem";
import SubjectAssignment from "./pages/admin/SubjectAssignment";
import Announcements from "./pages/admin/Announcements";
import Payments from "./pages/admin/Payments";
import PDFGeneration from "./pages/admin/PDFGeneration";
import AdminSettings from "./pages/admin/AdminSettings";
import Teachers from "./pages/admin/users/Teachers";
import Students from "./pages/admin/users/Students";
import Subjects from "./pages/admin/users/Subjects";
import Sections from "./pages/admin/users/Sections";
import SectionDetail from "./pages/admin/users/SectionDetail";


// Teacher pages
import Courses from "./pages/teacher/Courses";
import CourseManagement from "./pages/teacher/CourseManagement";
import ActivityDetail from "./pages/teacher/ActivityDetail";
import Activities from "./pages/teacher/Activities";
import StudentManagement from "./pages/teacher/StudentManagement";
import StudentDetail from "./pages/teacher/StudentDetail";
import GradeInput from "./pages/teacher/GradeInput";
import GradeInputEdit from "./pages/teacher/GradeInputEdit";
import TeacherSettings from "./pages/teacher/TeacherSettings";

// Student pages
import MyCourses from "./pages/student/MyCourses";
import CourseDetails from "./pages/student/CourseDetails";
import MyActivities from "./pages/student/MyActivities";
import MyGrades from "./pages/student/MyGrades";
import MyProgress from "./pages/student/MyProgress";
import CourseGradeDetail from "./pages/student/CourseGradeDetail";
import StudentSettings from "./pages/student/StudentSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/student/activities" element={<MyActivities />} />
            <Route path="/student/grades" element={<MyGrades />} />
            <Route path="/student/progress" element={<MyProgress />} />
            <Route path="/student/course-grade-detail" element={<CourseGradeDetail />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<Courses />} />
            <Route path="/teacher/courses/:courseId/activities/:activityId" element={<ActivityDetail />} />
            <Route path="/teacher/activities" element={<Activities />} />
            <Route path="/teacher/students" element={<StudentManagement />} />
            <Route path="/teacher/student-detail" element={<StudentDetail />} />
            <Route path="/teacher/grades" element={<GradeInput />} />
            <Route path="/teacher/grade-input-edit" element={<GradeInputEdit />} />
            <Route path="/teacher/settings" element={<TeacherSettings />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/users/teachers" element={<Teachers />} />
            <Route path="/admin/users/students" element={<Students />} />
            <Route path="/admin/users/subjects" element={<Subjects />} />
            <Route path="/admin/users/sections" element={<Sections />} />
            <Route path="/admin/users/sections/:sectionId" element={<SectionDetail />} />
            <Route path="/admin/grading" element={<GradingSystem />} />
            <Route path="/admin/assignments" element={<SubjectAssignment />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/pdf" element={<PDFGeneration />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/student/courses/:courseId" element={<CourseDetails />} />
            <Route path="/teacher/courses/:courseId" element={<CourseManagement />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
