import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Star, CheckCircle, Award } from "lucide-react"

export function CompanyProfileCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">ABC Construction Services</h2>
              <p className="text-gray-600">Construction • Mumbai, Maharashtra</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Company
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Award className="h-3 w-3 mr-1" />
                  Top Employer
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">4.6</div>
            <div className="flex items-center gap-1 justify-end">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on worker reviews</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
