import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@shared/schema";
import { ArrowUp, Mail, Users, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard-stats'],
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <>
      <Helmet>
        <title>Dashboard - E20 Phone Theft Email Campaign</title>
        <meta name="description" content="View statistics about the E20 residents' campaign to address phone theft issues through emails to MP Uma Kumaran." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Campaign Dashboard
          </h1>
          <p className="text-slate-600 max-w-3xl">
            Track the progress of our campaign to address phone theft in E20 through emails to our MP.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Emails Sent" 
            value={stats?.totalEmailsSent ?? 0} 
            icon={<Mail className="h-8 w-8 text-indigo-600" />}
            isLoading={isLoading} 
          />
          <StatCard 
            title="Emails Today" 
            value={stats?.emailsToday ?? 0} 
            icon={<ArrowUp className="h-8 w-8 text-green-600" />}
            isLoading={isLoading} 
          />
          <StatCard 
            title="E20 Postcodes" 
            value={stats?.uniquePostcodesCount ?? 0} 
            icon={<Users className="h-8 w-8 text-blue-600" />}
            isLoading={isLoading} 
          />
          <StatCard 
            title="Daily Average" 
            value={stats?.emailsSentByDay && stats.emailsSentByDay.length > 0 
              ? Math.round(stats.emailsSentByDay.reduce((sum, day) => sum + day.count, 0) / stats.emailsSentByDay.length) 
              : 0} 
            icon={<LineChart className="h-8 w-8 text-purple-600" />}
            isLoading={isLoading} 
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Emails */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">Failed to load recent participants data</div>
              ) : stats?.recentEmails && stats.recentEmails.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentEmails.map((email, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg border-slate-200 hover:bg-slate-50">
                      <div className="flex-shrink-0 bg-indigo-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-700 font-medium">{email.fullName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{email.fullName}</p>
                        <div className="text-sm text-slate-500">
                          <span>{email.sentAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No emails have been sent yet</p>
                  <Link href="/" className="text-blue-600 underline text-sm">
                    Go to the form to prepare your first email
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Postcodes Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Postcodes Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-2 w-4/5" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">Failed to load postcode data</div>
              ) : stats?.emailsByPostcode && stats.emailsByPostcode.length > 0 ? (
                <div className="space-y-6">
                  {stats.emailsByPostcode.map((item, index) => {
                    // Calculate percentage for the progress bar
                    const totalCount = stats.totalEmailsSent || 1; // Avoid division by zero
                    const percentage = Math.round((item.count / totalCount) * 100);
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium text-slate-700">{item.postcode}</div>
                          <div className="text-sm text-slate-500">{item.count} emails</div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-6">
                  <p className="mb-2">Postcode breakdown not available</p>
                  <p className="text-xs text-slate-400">
                    For privacy reasons, postcode breakdown is only shown when we have at least 5 different postcodes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer with disclaimer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <Separator className="mb-4" />
          <p>
            This dashboard displays anonymized statistics only. No personal information is stored or displayed.
            Last updated: {new Date().toLocaleString()}
          </p>
        </footer>
      </div>
    </>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
}

function StatCard({ title, value, icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            )}
          </div>
          <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}