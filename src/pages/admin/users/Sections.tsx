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
import { Plus, Search, Edit, Trash2, Grid3x3, Users, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertMessage } from "@/components/AlertMessage";

type Section = {
  id: string;
  name: string;
  students: string[];
  status: "active" | "inactive";
  description: string;
};

const Sections = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      name: "F1",
      students: ["John Doe", "Jane Smith", "Carlos Rodriguez", "Maria Garcia", "Ahmed Hassan"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
    {
      id: "2",
      name: "F2",
      students: ["Emily Johnson", "David Lee", "Lisa Wong", "Marcus Johnson", "Sarah Williams", "Alex Chen"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
    {
      id: "3",
      name: "F3",
      students: ["James Miller", "Patricia Brown", "Robert Davis", "Michael Wilson"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
    {
      id: "4",
      name: "F4",
      students: ["Jennifer Taylor", "Christopher Anderson", "Barbara Thomas", "Daniel Jackson", "Mary White", "Matthew Harris", "Linda Martin"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
    {
      id: "5",
      name: "F5",
      students: ["Nancy Thompson", "Joseph Garcia", "Karen Martinez", "Ryan Robinson"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
    {
      id: "6",
      name: "F6",
      students: ["Susan Clark", "Kevin Rodriguez", "Cynthia Lewis", "Brian Lee", "Kathleen Walker", "Edward Hall"],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<Omit<Section, "id">>({
    name: "",
    students: [],
    status: "active",
    description: "Bachelor of Science in Information Technology",
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

  // Listen for updates coming from the detail page so the list can stay in sync.
  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent carries the updated section in detail
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated = (e as CustomEvent).detail as Section;
      setSections((prev) => {
        const found = prev.some((s) => s.id === updated.id);
        if (found) return prev.map((s) => (s.id === updated.id ? updated : s));
        return [updated, ...prev];
      });
    };
    window.addEventListener("section-updated", handler as EventListener);
    return () => window.removeEventListener("section-updated", handler as EventListener);
  }, []);

  const filteredSections = sections.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = q === "" || s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleOpenCreate = () => {
    setForm({
      name: "",
      students: [],
      status: "active",
      description: "Bachelor of Science in Information Technology",
    });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.name.trim()) {
      showAlert("error", "Section name is required");
      return;
    }
    const newSection: Section = { id: Date.now().toString(), ...form };
    setSections((s) => [newSection, ...s]);
    setIsCreateOpen(false);
    showAlert("success", `Section ${form.name} created`);
  };

  const handleDelete = (id: string) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    if (!confirm(`Inactivate section ${s.name}? This will set the section to INACTIVE and remove all students from it. Continue?`)) return;
    const updated: Section = { ...s, status: "inactive", students: [] };
    setSections((prev) => prev.map((x) => (x.id === id ? updated : x)));
    // notify other parts of the app (detail page) that the section changed
    window.dispatchEvent(new CustomEvent("section-updated", { detail: updated }));
    showAlert("info", `Section ${s.name} set to inactive`);
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Manage Sections
            </h1>
            <p className="text-muted-foreground text-lg">Organize and manage class sections with students</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-5 w-5 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">All Sections ({filteredSections.length})</CardTitle>
                <CardDescription className="text-base">View and manage your class sections</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-2 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                    <SelectTrigger className="border-2 focus:border-accent-500 rounded-lg px-3 py-2 bg-background">
                      <SelectValue>{statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active Only" : "Inactive Only"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode((v) => (v === "list" ? "grid" : "list"))}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border-2 shadow-sm hover:bg-accent-50 hover:border-accent-300 transition-all"
                  title="Toggle view"
                  aria-pressed={viewMode === "grid"}
                >
                  {viewMode === "grid" ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  {viewMode === "list" ? "List" : "Grid"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {viewMode === "list" ? (
              <div className="space-y-4">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    className={`rounded-2xl border-2 transition-all duration-300 p-5 flex items-center justify-between ${
                      section.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-70"
                        : "bg-gradient-to-br from-card to-muted/30 border-accent-200 hover:border-accent-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                        section.status === "active"
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}>
                        <Grid3x3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-lg">{section.name}</p>
                          {section.description && (
                            <p className="text-sm text-muted-foreground hidden sm:inline-block">{section.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-semibold text-muted-foreground">{section.students.length} Students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={section.status === "active" ? "default" : "outline"}
                        className={`font-semibold px-3 py-1 shrink-0 ${
                          section.status === "active"
                            ? "bg-gradient-to-r from-primary to-accent text-white"
                            : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/sections/${section.id}`, { state: { section } })}
                        className="gap-2 font-medium hover:bg-accent-50 hover:border-accent-300 transition-all shrink-0"
                      >
                        <Edit className="h-4 w-4" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(section.id)}
                        disabled={section.status === "inactive"}
                        className={`text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-medium transition-all shrink-0 ${
                          section.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Deactivate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    className={`rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      section.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-70 hover:opacity-80"
              : "bg-gradient-to-br from-card to-muted/30 border-accent-200 hover:border-accent-400 hover:shadow-xl"
                    }`}
                  >
                    {/* Main content - dim when inactive */}
                    <div className={section.status === "inactive" ? "opacity-60 pointer-events-none p-5" : "p-5"}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                            section.status === "active"
                              ? "bg-gradient-to-br from-primary to-accent"
                              : "bg-gradient-to-br from-gray-300 to-gray-400"
                          }`}>
                            <Grid3x3 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xl">{section.name}</p>
                            {section.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{section.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={section.status === "active" ? "default" : "outline"}
                          className={`font-semibold px-3 py-1 ${
                            section.status === "active"
                              ? "bg-gradient-to-r from-primary to-accent text-white"
                              : "bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                        </Badge>
                      </div>

                      <div className={`rounded-xl p-4 mb-4 ${
                        section.status === "active"
                          ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                          : "bg-muted/50 border border-muted"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-muted-foreground">Total Students</span>
                          <span className={`text-3xl font-bold ${
                            section.status === "active"
                              ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                              : "text-muted-foreground"
                          }`}>
                            {section.students.length}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">enrolled in this section</div>
                      </div>
                    </div>

                    {/* Actions - keep enabled even when section is inactive */}
                    <div className={`mt-2 p-5 border-t ${
                      section.status === "inactive" ? "border-muted bg-muted/30" : "border-accent-100 bg-card/50"
                    }`}>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/users/sections/${section.id}`, { state: { section } })}
                          className="flex-1 gap-2 font-medium hover:bg-accent-50 hover:border-accent-300 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(section.id)}
                          disabled={section.status === "inactive"}
                          className={`text-destructive hover:text-destructive hover:bg-destructive/10 flex-1 gap-2 font-medium transition-all ${
                            section.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredSections.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Grid3x3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-medium">No sections found matching your filters</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary to-accent px-6 py-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-white">Create New Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 px-2">
              <div>
                <Label htmlFor="name" className="font-semibold text-lg">Section Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., F1, F2, CS101"
                  className="mt-2 py-3 text-base border-2 focus:border-purple-500 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="font-semibold text-lg">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g., Bachelor of Science in Information Technology"
                  className="mt-2 py-3 text-base border-2 focus:border-purple-500 rounded-lg"
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 font-medium">
                  ✓ New sections are created as <span className="font-bold">Active</span> by default and can be deactivated later.
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-white font-semibold text-base py-3 rounded-lg shadow-lg hover:shadow-xl transition-all mt-6" onClick={handleCreate}>
                Create Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      </div>
    </DashboardLayout>
  );
};

export default Sections;
