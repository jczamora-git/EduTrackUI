import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp } from "lucide-react";

const Payments = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const payments = [
    { student: "Sarah Davis", amount: "$500", type: "Tuition", status: "paid", date: "2025-01-15" },
    { student: "Emily Brown", amount: "$500", type: "Tuition", status: "pending", date: "2025-01-10" },
    { student: "Mike Johnson", amount: "$50", type: "Lab Fee", status: "paid", date: "2025-01-12" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage student payments</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold">$125,400</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">$8,500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">$42,300</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.student}</p>
                    <p className="text-sm text-muted-foreground">{payment.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{payment.amount}</p>
                    <Badge
                      variant={payment.status === "paid" ? "default" : "secondary"}
                      className={payment.status === "paid" ? "bg-success text-success-foreground" : ""}
                    >
                      {payment.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
