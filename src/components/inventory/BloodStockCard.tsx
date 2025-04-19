
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface BloodStockCardProps {
  bloodType: string
  units: number
  location: string
  expiryDate: string
  status: string
  component: string
}

export const BloodStockCard = ({ 
  bloodType, 
  units, 
  location, 
  expiryDate, 
  status,
  component 
}: BloodStockCardProps) => {
  const expiryDateObj = new Date(expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isNearExpiry = daysUntilExpiry <= 7

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 mb-2">
              {bloodType}
            </Badge>
            <h3 className="font-semibold text-lg">{component}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{units}</p>
            <p className="text-sm text-muted-foreground">units</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <p>Expires: {expiryDate}</p>
            {isNearExpiry && (
              <div className="flex items-center text-red-500 mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{daysUntilExpiry} days left</span>
              </div>
            )}
          </div>
          <Badge 
            variant={status === 'available' ? 'default' : 'secondary'}
            className={
              status === 'available' 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
