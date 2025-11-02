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
import { Plus, Search, Edit, Trash2, GraduationCap, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertMessage } from "@/components/AlertMessage";

type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  status: "active" | "inactive";
  assignedCourses: { course: string; title?: string; units?: number; sections: string[] }[];
};

const Teachers = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@edu.com",
      employeeId: "EMP001",
      phone: "+1234567890",
      status: "active",
      assignedCourses: [
        { course: "CS101", title: "Sample Course CS101", units: 3, sections: ["F1", "F2"] },
        { course: "CS201", title: "Sample Course CS201", units: 3, sections: ["F1", "F3"] },
      ],
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@edu.com",
      employeeId: "EMP002",
      phone: "+1234567891",
      status: "active",
  assignedCourses: [{ course: "MATH101", title: "Mathematics 101", units: 3, sections: ["F1"] }],
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.w@edu.com",
      employeeId: "EMP003",
      phone: "+1234567892",
      status: "active",
      assignedCourses: [
        { course: "ENG101", title: "English 101", units: 3, sections: ["F2"] },
        { course: "ENG102", title: "English 102", units: 3, sections: [] },
      ],
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Teacher, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    phone: "",
    status: "active",
    assignedCourses: [],
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

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    const fullname = `${t.firstName} ${t.lastName}`.toLowerCase();
    const matchesQuery = q === "" || fullname.includes(q) || t.email.toLowerCase().includes(q) || t.employeeId.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const SECTION_LABELS = ["F1", "F2", "F3", "F4", "F5", "F6"];

  const COURSES = [
    { code: "ENG001", title: "Grammar and Composition 1", units: 3 },
    { code: "SOCSCI111", title: "Pag-unawa sa Sarili", units: 3 },
    { code: "LIT111", title: "Philippine Literature", units: 3 },
    { code: "FIL111", title: "Kontekstwal... Komunikasyon sa Filipino", units: 3 },
    { code: "ITC111", title: "Intro to Computing", units: 3 },
    { code: "ITC112", title: "Computer Programming 1", units: 3 },

    { code: "SOCSCI112", title: "Gender and Society", units: 3 },
    { code: "FIL112", title: "Filipino sa Iba't Ibang Disiplina", units: 3 },
    { code: "ENG111", title: "Purposive Communication", units: 3 },
    { code: "ITC121", title: "Computer Programming 2", units: 3 },
    { code: "ITP121", title: "Discrete Mathematics", units: 3 },
    { code: "ITP122", title: "Intro to Human Computer Interaction 1", units: 3 },
    { code: "ITE121", title: "Electronics with Technical Drawing", units: 3 },
    { code: "NSTP2", title: "National Service Training Program 2", units: 3 },

    { code: "ENG002", title: "Business Communication", units: 3 },
    { code: "ITC211", title: "Data Structures with Algorithm", units: 3 },
    { code: "ITC212", title: "Information Management", units: 3 },
    { code: "ITE211", title: "Human Computer Interaction 2", units: 3 },
    { code: "ITE212", title: "Object Oriented Programming", units: 3 },
    { code: "ITE213", title: "Platform Technologies", units: 3 },
    { code: "PE221", title: "Individual/Dual Sports 2", units: 2 },

    { code: "ITP221", title: "Advanced Database Systems", units: 3 },
    { code: "ITP222", title: "Quantitative Methods", units: 3 },
    { code: "ITP223", title: "Networking 1", units: 3 },
    { code: "ITP224", title: "Integrative Programming and Technologies 1", units: 3 },
    { code: "ITE221", title: "Web Systems and Technologies", units: 3 },
    { code: "ITE222", title: "Embedded System", units: 3 },
    { code: "PE222", title: "Team Games and Sports 2", units: 2 },

    { code: "ITC311", title: "Application Development and Emerging Technologies", units: 3 },
    { code: "ITP311", title: "Networking 2", units: 3 },
    { code: "ITP312", title: "IT Research Methods", units: 3 },
    { code: "ITP313", title: "Event Driven Programming", units: 3 },
    { code: "ITP314", title: "Systems Integration & Architecture 1", units: 3 },
    { code: "ITE311", title: "Web Systems and Technologies 2", units: 3 },
  ];

  const normalize = (s: string) => s.replace(/\s+/g, "").toUpperCase();

  const getCourseSuggestions = (query: string) => {
    const q = normalize(query || "");
    if (!q) return [];
    return COURSES.filter((c) => c.code.includes(q) || c.title.toUpperCase().includes(query.trim().toUpperCase())).slice(0, 8);
  };

  const setCourseFromSuggestion = (idx: number, courseObj: { code: string; title: string; units: number }) => {
    setForm((f) => ({
      ...f,
      assignedCourses: f.assignedCourses.map((ac, i) => (i === idx ? { ...ac, course: courseObj.code, title: courseObj.title, units: courseObj.units } : ac)),
    }));
  };

  const [focusedCourseIdx, setFocusedCourseIdx] = useState<number | null>(null);

  const addCourseRow = () => {
    setForm((f) => ({ ...f, assignedCourses: [...f.assignedCourses, { course: "", sections: [] }] }));
  };

  const removeCourseRow = (idx: number) => {
    setForm((f) => ({ ...f, assignedCourses: f.assignedCourses.filter((_, i) => i !== idx) }));
  };

  const updateCourseCode = (idx: number, value: string) => {
    setForm((f) => ({
      ...f,
      assignedCourses: f.assignedCourses.map((ac, i) => (i === idx ? { ...ac, course: value, title: undefined, units: undefined } : ac)),
    }));
  };

  const toggleSection = (idx: number, section: string) => {
    setForm((f) => ({
      ...f,
      assignedCourses: f.assignedCourses.map((ac, i) => {
        if (i !== idx) return ac;
        const has = ac.sections.includes(section);
        return { ...ac, sections: has ? ac.sections.filter((s) => s !== section) : [...ac.sections, section] };
      }),
    }));
  };


  const handleOpenCreate = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      employeeId: "",
      phone: "",
      status: "active",
      assignedCourses: [],
    });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.employeeId.trim()) {
      showAlert("error", "First name, last name, email and employee ID are required");
      return;
    }
    const newTeacher: Teacher = { id: Date.now().toString(), ...form };
    setTeachers((s) => [newTeacher, ...s]);
    setIsCreateOpen(false);
    showAlert("success", `Teacher ${form.firstName} ${form.lastName} created`);
  };

  const handleOpenEdit = (t: Teacher) => {
    setSelectedTeacherId(t.id);
    setForm({
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      employeeId: t.employeeId,
      phone: t.phone,
      status: t.status,
      assignedCourses: t.assignedCourses,
    });
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedTeacherId) return;
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === selectedTeacherId
          ? { ...t, ...form }
          : t
      )
    );
    setIsEditOpen(false);
    setSelectedTeacherId(null);
    showAlert("success", "Teacher updated");
  };

  const handleDelete = (id: string) => {
    const t = teachers.find((x) => x.id === id);
    if (!t) return;
    if (!confirm(`Delete teacher ${t.firstName} ${t.lastName}? This action cannot be undone.`)) return;
    setTeachers((prev) => prev.filter((x) => x.id !== id));
    showAlert("info", "Teacher deleted");
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Teachers</h1>
            <p className="text-muted-foreground">Create and manage teacher accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
                <CardDescription>Faculty members in the institution</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-5 border border-border rounded-xl bg-white hover:shadow-md transition-all hover:border-primary/20"
                >
                  {/* Header: Teacher Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                        <GraduationCap className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-lg">{teacher.firstName} {teacher.lastName}</p>
                          <Badge variant="outline" className="text-xs font-semibold">
                            {teacher.employeeId}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={teacher.status === "active" ? "default" : "outline"} className="font-medium">
                        {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Courses Section */}
                  {teacher.assignedCourses.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{teacher.assignedCourses.length} Assigned Course{teacher.assignedCourses.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teacher.assignedCourses.map((ac, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-border/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-foreground">{ac.course}</p>
                                {ac.title && <p className="text-xs text-muted-foreground line-clamp-2">{ac.title}</p>}
                              </div>
                              {ac.units !== undefined && (
                                <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                                  {ac.units} u
                                </Badge>
                              )}
                            </div>
                            {ac.sections.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {ac.sections.map((s) => (
                                  <Badge key={s} variant="default" className="text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenEdit(teacher)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(teacher.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers found matching your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="font-semibold">First Name *</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      placeholder="First name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-semibold">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      placeholder="Last name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId" className="font-semibold">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={form.employeeId}
                      onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                      placeholder="e.g., EMP001"
                      className="mt-1"
                    />
                  </div>
                </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@edu.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="font-semibold">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
              </div>
                <div>
                  <Label htmlFor="status" className="font-semibold">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div>
                <Label className="font-semibold">Assigned Courses</Label>
                <div className="space-y-3 mt-3">
                  {form.assignedCourses.map((ac, idx) => (
                    <div key={idx} className="space-y-2 p-4 border rounded-lg bg-muted/30 transition-colors hover:bg-muted/40">
                      <div className="flex items-start gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Search course e.g., ITC111"
                            value={ac.course}
                            onChange={(e) => updateCourseCode(idx, e.target.value)}
                            onFocus={() => setFocusedCourseIdx(idx)}
                            onBlur={() => setTimeout(() => setFocusedCourseIdx((v) => (v === idx ? null : v)), 150)}
                            className="w-full"
                          />
                          {focusedCourseIdx === idx && ac.course && (
                            <div className="absolute z-20 top-full left-0 mt-1 w-full max-h-64 overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
                              {getCourseSuggestions(ac.course).map((c) => (
                                <div
                                  key={c.code}
                                  className="p-3 hover:bg-muted/60 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                                  onMouseDown={() => { setCourseFromSuggestion(idx, c); setFocusedCourseIdx(null); }}
                                >
                                  <div className="font-semibold text-sm">{c.code}</div>
                                  <div className="text-sm text-foreground/90">{c.title}</div>
                                  <div className="text-xs text-muted-foreground">{c.units} units</div>
                                </div>
                              ))}
                              {getCourseSuggestions(ac.course).length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No courses found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => removeCourseRow(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {ac.course && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections:</span>
                          <div className="flex gap-2 flex-wrap">
                            {SECTION_LABELS.map((s) => {
                              const active = ac.sections.includes(s);
                              return (
                                <Button
                                  key={s}
                                  size="sm"
                                  variant={active ? "default" : "outline"}
                                  className="font-medium"
                                  onClick={() => toggleSection(idx, s)}
                                >
                                  {s}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button onClick={addCourseRow} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                  <p className="text-xs text-muted-foreground">Assign courses and select sections (F1..F6)</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-white font-semibold" onClick={handleCreate}>
                Add Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-firstName" className="font-semibold">First Name *</Label>
                    <Input
                      id="edit-firstName"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lastName" className="font-semibold">Last Name *</Label>
                    <Input
                      id="edit-lastName"
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-employeeId" className="font-semibold">Employee ID *</Label>
                    <Input
                      id="edit-employeeId"
                      value={form.employeeId}
                      onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email" className="font-semibold">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone" className="font-semibold">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
                <div>
                  <Label htmlFor="edit-status" className="font-semibold">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div>
                <Label className="font-semibold">Assigned Courses</Label>
                <div className="space-y-3 mt-3">
                  {form.assignedCourses.map((ac, idx) => (
                    <div key={idx} className="space-y-2 p-4 border rounded-lg bg-muted/30 transition-colors hover:bg-muted/40">
                      <div className="flex items-start gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Search course e.g., ITC111"
                            value={ac.course}
                            onChange={(e) => updateCourseCode(idx, e.target.value)}
                            onFocus={() => setFocusedCourseIdx(idx)}
                            onBlur={() => setTimeout(() => setFocusedCourseIdx((v) => (v === idx ? null : v)), 150)}
                            className="w-full"
                          />
                          {focusedCourseIdx === idx && ac.course && (
                            <div className="absolute z-20 top-full left-0 mt-1 w-full max-h-64 overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
                              {getCourseSuggestions(ac.course).map((c) => (
                                <div
                                  key={c.code}
                                  className="p-3 hover:bg-muted/60 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                                  onMouseDown={() => { setCourseFromSuggestion(idx, c); setFocusedCourseIdx(null); }}
                                >
                                  <div className="font-semibold text-sm">{c.code}</div>
                                  <div className="text-sm text-foreground/90">{c.title}</div>
                                  <div className="text-xs text-muted-foreground">{c.units} units</div>
                                </div>
                              ))}
                              {getCourseSuggestions(ac.course).length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No courses found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => removeCourseRow(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {ac.course && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections:</span>
                          <div className="flex gap-2 flex-wrap">
                            {SECTION_LABELS.map((s) => {
                              const active = ac.sections.includes(s);
                              return (
                                <Button
                                  key={s}
                                  size="sm"
                                  variant={active ? "default" : "outline"}
                                  className="font-medium"
                                  onClick={() => toggleSection(idx, s)}
                                >
                                  {s}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button onClick={addCourseRow} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                  <p className="text-xs text-muted-foreground">Assign courses and select sections (F1..F6)</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-white font-semibold" onClick={handleEdit}>
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
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

export default Teachers;
