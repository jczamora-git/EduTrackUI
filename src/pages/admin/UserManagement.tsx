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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertMessage } from "@/components/AlertMessage";

const UserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  type User = { id: string; name: string; email: string; role: "admin" | "teacher" | "student"; status: string };

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Smith", email: "john@edu.com", role: "teacher", status: "active" },
    { id: "2", name: "Sarah Davis", email: "sarah@edu.com", role: "student", status: "active" },
    { id: "3", name: "Mike Wilson", email: "mike@edu.com", role: "teacher", status: "active" },
    { id: "4", name: "Emily Brown", email: "emily@edu.com", role: "student", status: "active" },
  ]);

  // Dialog/form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; role: "admin" | "teacher" | "student"; status: string }>({
    name: "",
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
    const matchesQuery = q === "" || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleOpenCreate = () => {
    setForm({ name: "", email: "", role: "student", status: "active" });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim()) {
      showAlert("error", "Name and email are required");
      return;
    }
    const newUser: User = { id: Date.now().toString(), name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status };
    setUsers((s) => [newUser, ...s]);
    setIsCreateOpen(false);
    showAlert("success", "User created");
  };

  const handleOpenEdit = (u: User) => {
    setSelectedUserId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status });
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedUserId) return;
    setUsers((prev) => prev.map((u) => (u.id === selectedUserId ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status } : u)));
    setIsEditOpen(false);
    setSelectedUserId(null);
    showAlert("success", "User updated");
  };

  const handleDelete = (id: string) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    if (!confirm(`Delete user ${u.name}? This action cannot be undone.`)) return;
    setUsers((prev) => prev.filter((x) => x.id !== id));
    showAlert("info", "User deleted");
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Create and manage user accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v)}>
                <SelectTrigger>
                  <SelectValue>{roleFilter === "all" ? "All roles" : roleFilter}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all system users</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{user.role}</Badge>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create dialog (controlled) */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                  <SelectTrigger>
                    <SelectValue>{form.role}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreate}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit dialog (controlled) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                  <SelectTrigger>
                    <SelectValue>{form.role}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleEdit}>Save</Button>
                <Button variant="ghost" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
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
