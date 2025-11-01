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


// Teacher pages
import Courses from "./pages/teacher/Courses";
import CourseManagement from "./pages/teacher/CourseManagement";
import Activities from "./pages/teacher/Activities";
import StudentManagement from "./pages/teacher/StudentManagement";
import GradeInput from "./pages/teacher/GradeInput";

// Student pages
import MyCourses from "./pages/student/MyCourses";
import CourseDetails from "./pages/student/CourseDetails";
import MyActivities from "./pages/student/MyActivities";
import MyGrades from "./pages/student/MyGrades";
import MyProgress from "./pages/student/MyProgress";

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
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/student/activities" element={<MyActivities />} />
            <Route path="/student/grades" element={<MyGrades />} />
            <Route path="/student/progress" element={<MyProgress />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<Courses />} />
            <Route path="/teacher/activities" element={<Activities />} />
            <Route path="/teacher/students" element={<StudentManagement />} />
            <Route path="/teacher/grades" element={<GradeInput />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/grading" element={<GradingSystem />} />
            <Route path="/admin/assignments" element={<SubjectAssignment />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/pdf" element={<PDFGeneration />} />
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
