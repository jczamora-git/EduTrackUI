import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, User, BookOpen, LayoutGrid, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertMessage } from "@/components/AlertMessage";

type Student = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  yearLevel: "1" | "2" | "3" | "4";
  section: string;
  phone?: string;
  parentContact?: {
    name: string;
    phone: string;
  };
  status: "active" | "inactive" | "graduated";
  enrolledCourses: string[];
};

const Students = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearLevelFilter, setYearLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortOption, setSortOption] = useState<string>("name_asc");

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Sarah Davis",
      email: "sarah.d@student.edu.com",
      studentId: "STU2024001",
      yearLevel: "1",
      section: "A",
      phone: "+1234567890",
      parentContact: {
        name: "Mary Davis",
        phone: "+1234567800",
      },
      status: "active",
      enrolledCourses: ["CS101", "MATH101", "ENG101"],
    },
    {
      id: "2",
      name: "Emily Brown",
      email: "emily.b@student.edu.com",
      studentId: "STU2024002",
      yearLevel: "2",
      section: "B",
      phone: "+1234567891",
      status: "active",
      enrolledCourses: ["CS201", "MATH201"],
    },
    {
      id: "3",
      name: "James Wilson",
      email: "james.w@student.edu.com",
      studentId: "STU2023015",
      yearLevel: "3",
      section: "A",
      phone: "+1234567892",
      status: "active",
      enrolledCourses: ["CS301", "CS302", "MATH301"],
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    studentId: "",
    yearLevel: "1",
    section: "A",
    phone: "",
    parentContact: undefined,
    status: "active",
    enrolledCourses: [],
  });

  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q);
    const matchesYearLevel = yearLevelFilter === "all" || s.yearLevel === yearLevelFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchesQuery && matchesYearLevel && matchesStatus;
  });

  // available sections for the Section filter dropdown
  const availableSections = Array.from(new Set(students.map((s) => s.section))).sort();

  // apply sorting on a copy
  const sortedStudents = (() => {
    const list = [...filteredStudents];
    switch (sortOption) {
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "id_asc":
        return list.sort((a, b) => a.studentId.localeCompare(b.studentId));
      case "id_desc":
        return list.sort((a, b) => b.studentId.localeCompare(a.studentId));
      case "year_asc":
        return list.sort((a, b) => parseInt(a.yearLevel) - parseInt(b.yearLevel));
      case "year_desc":
        return list.sort((a, b) => parseInt(b.yearLevel) - parseInt(a.yearLevel));
      default:
        return list;
    }
  })();

  const handleOpenCreate = () => {
    setForm({
      name: "",
      email: "",
      studentId: "",
      yearLevel: "1",
      section: "A",
      phone: "",
      parentContact: undefined,
      status: "active",
      enrolledCourses: [],
    });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.studentId.trim()) {
      showAlert("error", "Name, email and student ID are required");
      return;
    }
    const newStudent: Student = { id: Date.now().toString(), ...form };
    setStudents((s) => [newStudent, ...s]);
    setIsCreateOpen(false);
    showAlert("success", `Student ${form.name} created`);
  };

  const handleOpenEdit = (s: Student) => {
    setSelectedStudentId(s.id);
    setForm({
      name: s.name,
      email: s.email,
      studentId: s.studentId,
      yearLevel: s.yearLevel,
      section: s.section,
      phone: s.phone,
      parentContact: s.parentContact,
      status: s.status,
      enrolledCourses: s.enrolledCourses,
    });
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedStudentId) return;
    setStudents((prev) => prev.map((s) => (s.id === selectedStudentId ? { ...s, ...form } : s)));
    setIsEditOpen(false);
    setSelectedStudentId(null);
    showAlert("success", "Student updated");
  };

  const handleDelete = (id: string) => {
    const s = students.find((x) => x.id === id);
    if (!s) return;
    if (!confirm(`Inactivate student ${s.name}? This will set the student to INACTIVE status.`)) return;
    setStudents((prev) => prev.map((x) => (x.id === id ? { ...x, status: "inactive" } : x)));
    showAlert("info", `Student ${s.name} has been set to inactive`);
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Manage Students</h1>
            <p className="text-muted-foreground">View and manage student accounts and enrollments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="ml-auto">
              <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">All Students ({filteredStudents.length})</CardTitle>
                <CardDescription>Enrolled students in the institution</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-2.5 text-base border-2 focus:border-accent-500 rounded-xl bg-background shadow-sm"
                />
              </div>
            
                <div className="flex items-center gap-3">
                  <div className="w-36">
                    <Select value={yearLevelFilter} onValueChange={setYearLevelFilter}>
                      <SelectTrigger className="border-2 rounded-xl px-3 py-2 bg-background font-medium shadow-sm">
                        {yearLevelFilter === "all" ? "All Years" : `${yearLevelFilter}st Year`}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-40">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-2 rounded-xl px-3 py-2 bg-background font-medium shadow-sm">
                        {statusFilter === "all" ? "All Status" : statusFilter}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-40">
                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                      <SelectTrigger className="border-2 rounded-xl px-3 py-2 bg-background font-medium shadow-sm">
                        {sectionFilter === "all" ? "All Sections" : `Section ${sectionFilter}`}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {availableSections.map((sec) => (
                          <SelectItem key={sec} value={sec}>{`Section ${sec}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-44">
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="border-2 rounded-xl px-4 py-2.5 bg-background font-medium shadow-sm">
                        {sortOption === "name_asc" && "Name A → Z"}
                        {sortOption === "name_desc" && "Name Z → A"}
                        {sortOption === "id_asc" && "ID A → Z"}
                        {sortOption === "id_desc" && "ID Z → A"}
                        {sortOption === "year_asc" && "Year ↑"}
                        {sortOption === "year_desc" && "Year ↓"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name_asc">Name A → Z</SelectItem>
                        <SelectItem value="name_desc">Name Z → A</SelectItem>
                        <SelectItem value="id_asc">Student ID A → Z</SelectItem>
                        <SelectItem value="id_desc">Student ID Z → A</SelectItem>
                        <SelectItem value="year_asc">Year ↑</SelectItem>
                        <SelectItem value="year_desc">Year ↓</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode((v) => (v === "list" ? "grid" : "list"))}
                    className="px-4 py-2.5 rounded-xl font-medium border-2 gap-2 shadow-sm hover:bg-accent-50 hover:border-accent-300 transition-all"
                    title="Toggle view"
                    aria-pressed={viewMode === "grid"}
                  >
                    {viewMode === "grid" ? <LayoutGrid className="h-5 w-5" /> : <List className="h-5 w-5" />}
                    <span>{viewMode === "grid" ? "Grid" : "List"}</span>
                  </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`rounded-2xl border-2 transition-all duration-300 flex flex-col overflow-hidden ${
                      student.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-70"
                        : "bg-gradient-to-br from-card to-muted/30 border-accent-200 hover:border-accent-400 hover:shadow-lg"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-5 flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                          student.status === "active" ? "bg-gradient-to-br from-primary to-accent" : "bg-slate-300"
                        }`}>
                          <User className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg">{student.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">Year {student.yearLevel} • Section {student.section}</p>
                        </div>
                      </div>
                      <Badge
                        variant={student.status === "active" ? "default" : student.status === "graduated" ? "secondary" : "outline"}
                        className={`font-semibold ml-2 ${
                          student.status === "active" ? "bg-gradient-to-r from-primary to-accent text-white" : ""
                        }`}
                      >
                        {student.status}
                      </Badge>
                    </div>

                    {/* Card Metadata */}
                    <div className={`px-5 py-3 ${
                      student.status === "active"
                        ? "bg-gradient-to-r from-primary/5 to-accent/5 border-t border-primary/10"
                        : "bg-muted/30 border-t border-muted"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Student ID</p>
                          <p className="text-sm font-medium">{student.studentId}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium mb-1">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span>{student.enrolledCourses.length} courses</span>
                          </div>
                          {student.enrolledCourses.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {student.enrolledCourses.slice(0, 2).join(", ")}
                              {student.enrolledCourses.length > 2 && "..."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className={`px-5 py-4 border-t ${
                      student.status === "inactive" ? "border-muted bg-muted/30" : "border-accent-100 bg-card/50"
                    }`}>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(student)}
                          className="flex-1 gap-2 font-medium hover:bg-accent-50 hover:border-accent-300 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          disabled={student.status === "inactive"}
                          className={`text-destructive hover:text-destructive hover:bg-destructive/10 font-medium transition-all px-3 ${
                            student.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`rounded-2xl border-2 transition-all duration-300 flex items-center justify-between p-4 ${
                      student.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-80"
                        : "bg-card border-accent-100 hover:border-accent-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                        student.status === "active" ? "bg-gradient-to-br from-primary to-accent" : "bg-slate-200"
                      }`}>
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">{student.name}</p>
                          <Badge variant="outline" className="text-xs flex-shrink-0">{student.studentId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-xs text-muted-foreground">Year {student.yearLevel} • Section {student.section}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <BookOpen className="h-4 w-4" />
                          <span>{student.enrolledCourses.length} courses</span>
                        </div>
                        {student.enrolledCourses.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.enrolledCourses.slice(0, 3).join(", ")}
                            {student.enrolledCourses.length > 3 && "..."}
                          </p>
                        )}
                      </div>

                      <Badge variant={student.status === "active" ? "default" : student.status === "graduated" ? "secondary" : "outline"}>
                        {student.status}
                      </Badge>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(student.id)}
                          disabled={student.status === "inactive"}
                          className={student.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {sortedStudents.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium">No students found matching your filters</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary to-accent px-6 py-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-white">Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={form.studentId}
                    onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                    placeholder="e.g., STU2024001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="student@edu.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yearLevel">Year Level</Label>
                  <Select value={form.yearLevel} onValueChange={(v) => setForm((f) => ({ ...f, yearLevel: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={form.section}
                    onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                    placeholder="A"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Parent/Guardian Contact (Optional)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="parentName" className="text-xs">Name</Label>
                    <Input
                      id="parentName"
                      value={form.parentContact?.name || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentContact: { name: e.target.value, phone: f.parentContact?.phone || "" },
                        }))
                      }
                      placeholder="Parent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentPhone" className="text-xs">Phone</Label>
                    <Input
                      id="parentPhone"
                      value={form.parentContact?.phone || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentContact: { name: f.parentContact?.name || "", phone: e.target.value },
                        }))
                      }
                      placeholder="Parent phone"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="courses">Enrolled Courses (comma separated)</Label>
                <Input
                  id="courses"
                  value={form.enrolledCourses.join(", ")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      enrolledCourses: e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="e.g., CS101, MATH101, ENG101"
                />
                <p className="text-xs text-muted-foreground mt-1">Enter course codes separated by commas</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 font-semibold rounded-lg shadow-lg" onClick={handleCreate}>
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary to-accent px-6 py-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-white">Edit Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-studentId">Student ID *</Label>
                  <Input
                    id="edit-studentId"
                    value={form.studentId}
                    onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-yearLevel">Year Level</Label>
                  <Select value={form.yearLevel} onValueChange={(v) => setForm((f) => ({ ...f, yearLevel: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-section">Section</Label>
                  <Input
                    id="edit-section"
                    value={form.section}
                    onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Parent/Guardian Contact (Optional)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="edit-parentName" className="text-xs">Name</Label>
                    <Input
                      id="edit-parentName"
                      value={form.parentContact?.name || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentContact: { name: e.target.value, phone: f.parentContact?.phone || "" },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-parentPhone" className="text-xs">Phone</Label>
                    <Input
                      id="edit-parentPhone"
                      value={form.parentContact?.phone || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentContact: { name: f.parentContact?.name || "", phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-courses">Enrolled Courses (comma separated)</Label>
                <Input
                  id="edit-courses"
                  value={form.enrolledCourses.join(", ")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      enrolledCourses: e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">Enter course codes separated by commas</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 font-semibold rounded-lg shadow-lg" onClick={handleEdit}>
                  Save Changes
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      </div>
    </DashboardLayout>
  );
};

export default Students;
