import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, TrendingUp, Target } from "lucide-react"

const stats = [
  { title: "Active Jobs", value: "5", change: "+2 from last month", icon: Briefcase },
  { title: "Total Applications", value: "127", change: "Across all jobs", icon: Users },
  { title: "Hired Workers", value: "23", change: "This year", icon: TrendingUp },
  { title: "Success Rate", value: "78%", change: "Successful hires", icon: Target },
]

export function EmployerStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
