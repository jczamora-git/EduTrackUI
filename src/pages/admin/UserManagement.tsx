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
import { Plus, Search, Edit, Trash2, Users, Grid3x3, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertMessage } from "@/components/AlertMessage";

const UserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  type User = { id: string; firstName: string; lastName: string; email: string; role: "admin" | "teacher" | "student"; status: string };

  const [users, setUsers] = useState<User[]>([
    { id: "1", firstName: "John", lastName: "Smith", email: "john@edu.com", role: "teacher", status: "active" },
    { id: "2", firstName: "Sarah", lastName: "Davis", email: "sarah@edu.com", role: "student", status: "active" },
    { id: "3", firstName: "Mike", lastName: "Wilson", email: "mike@edu.com", role: "teacher", status: "active" },
    { id: "4", firstName: "Emily", lastName: "Brown", email: "emily@edu.com", role: "student", status: "active" },
  ]);

  // Dialog/form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form, setForm] = useState<{ firstName: string; lastName: string; email: string; role: "admin" | "teacher" | "student"; status: string }>({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    status: "active",
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

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesQuery = q === "" || fullName.includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleOpenCreate = () => {
    setForm({ firstName: "", lastName: "", email: "", role: "student", status: "active" });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      showAlert("error", "First name, last name and email are required");
      return;
    }
    const newUser: User = { id: Date.now().toString(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), role: form.role, status: form.status };
    setUsers((s) => [newUser, ...s]);
    setIsCreateOpen(false);
    showAlert("success", "User created");
  };

  const handleOpenEdit = (u: User) => {
    setSelectedUserId(u.id);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, status: u.status });
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedUserId) return;
    setUsers((prev) => prev.map((u) => (u.id === selectedUserId ? { ...u, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), role: form.role, status: form.status } : u)));
    setIsEditOpen(false);
    setSelectedUserId(null);
    showAlert("success", "User updated");
  };

  const handleDelete = (id: string) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    if (!confirm(`Inactivate user ${u.firstName} ${u.lastName}? This will set the user to INACTIVE status.`)) return;
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, status: "inactive" } : x)));
    showAlert("info", `User ${u.firstName} ${u.lastName} has been set to inactive`);
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground text-lg">Create and manage user accounts across all roles</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-5 w-5 mr-2" />
              Create User
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">All Users ({filteredUsers.length})</CardTitle>
                <CardDescription className="text-base">Manage all system users and their roles</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-2 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
                <div className="w-40">
                  <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v)}>
                    <SelectTrigger className="border-2 focus:border-accent-500 rounded-lg px-3 py-2 bg-background">
                      <SelectValue>{roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
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
                  {viewMode === "list" ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  {viewMode === "list" ? "Grid" : "List"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`rounded-2xl border-2 transition-all duration-300 flex flex-col overflow-hidden ${
                      user.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-70"
                        : "bg-gradient-to-br from-card to-muted/30 border-accent-200 hover:border-accent-400 hover:shadow-xl"
                    }`}
                  >
                    <div className={user.status === "inactive" ? "p-5 opacity-60 pointer-events-none" : "p-5"}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                            <span className="font-bold text-lg text-white">
                              {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge 
                          variant="secondary" 
                          className="capitalize font-semibold px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                        >
                          {user.role}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="bg-success/10 text-success border-success/20 font-semibold px-3 py-1"
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-auto p-5 border-t border-accent-100 bg-muted/30">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(user)}
                          className="flex-1 gap-2 font-medium hover:bg-accent-50 hover:border-accent-300 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.status === "inactive"}
                          className={`text-destructive hover:text-destructive hover:bg-destructive/10 flex-1 gap-2 font-medium transition-all ${
                            user.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-5 border-2 rounded-2xl transition-all duration-300 ${
                      user.status === "inactive"
                        ? "bg-muted/50 border-muted opacity-70"
                        : "bg-card border-accent-100 hover:bg-accent-50/50 hover:border-accent-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                        <span className="font-bold text-lg text-white">
                          {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-base">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className="capitalize font-semibold px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                      >
                        {user.role}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="bg-success/10 text-success border-success/20 font-semibold px-3 py-1.5"
                      >
                        {user.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEdit(user)}
                        className="hover:bg-accent-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.status === "inactive"}
                        className={`transition-colors ${user.status === "inactive" ? "opacity-50 cursor-not-allowed" : "hover:bg-destructive/10"}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-medium">No users found matching your filters</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create dialog (controlled) */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary to-accent px-6 py-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-white">Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 px-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-semibold text-lg">First Name *</Label>
                  <Input 
                    id="firstName" 
                    value={form.firstName} 
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} 
                    placeholder="Enter first name" 
                    className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-semibold text-lg">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    value={form.lastName} 
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} 
                    placeholder="Enter last name" 
                    className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold text-lg">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} 
                  placeholder="Enter email address" 
                  className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="role" className="font-semibold text-lg">Role *</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                  <SelectTrigger className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg bg-background">
                    <SelectValue>{form.role.charAt(0).toUpperCase() + form.role.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-muted/20 border-2 border-muted rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground font-medium">
                  ✓ New users are created with <span className="font-bold">Active</span> status by default
                </p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-white font-semibold text-base py-3 rounded-lg shadow-lg hover:shadow-xl transition-all mt-6" 
                onClick={handleCreate}
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit dialog (controlled) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary to-accent px-6 py-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-white">Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 px-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName" className="font-semibold text-lg">First Name *</Label>
                  <Input 
                    id="edit-firstName" 
                    value={form.firstName} 
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} 
                    placeholder="Enter first name" 
                    className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName" className="font-semibold text-lg">Last Name *</Label>
                  <Input 
                    id="edit-lastName" 
                    value={form.lastName} 
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} 
                    placeholder="Enter last name" 
                    className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-email" className="font-semibold text-lg">Email *</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} 
                  placeholder="Enter email address" 
                  className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-role" className="font-semibold text-lg">Role *</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                  <SelectTrigger className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg bg-background">
                    <SelectValue>{form.role.charAt(0).toUpperCase() + form.role.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status" className="font-semibold text-lg">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger className="mt-2 py-3 text-base border-2 focus:border-accent-500 rounded-lg bg-background">
                    <SelectValue>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-white font-semibold text-base py-3 rounded-lg shadow-lg hover:shadow-xl transition-all" 
                  onClick={handleEdit}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 font-semibold text-base py-3 border-2 rounded-lg hover:bg-muted/50" 
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
