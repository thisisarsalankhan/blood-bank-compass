
import { Card, CardContent } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { AlertCircle } from "lucide-react"

interface InventoryStatsProps {
  totalUnits: number
  expiringUnits: number
  criticalTypes: string[]
  bloodTypeDistribution: {
    name: string
    value: number
  }[]
}

export const InventoryStats = ({
  totalUnits,
  expiringUnits,
  criticalTypes,
  bloodTypeDistribution
}: InventoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Total Blood Units</p>
            <p className="text-3xl font-bold">{totalUnits}</p>
            <p className="text-sm text-muted-foreground mt-2">Across all blood types</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Critical Stock</p>
            <p className="text-3xl font-bold">{criticalTypes.length}</p>
            <div className="flex items-start gap-2 mt-2">
              {criticalTypes.length > 0 && <AlertCircle className="h-4 w-4 text-red-500 mt-1" />}
              <p className="text-sm text-muted-foreground">
                {criticalTypes.length > 0 
                  ? `Low: ${criticalTypes.join(', ')}` 
                  : 'All blood types at healthy levels'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
            <p className="text-3xl font-bold">{expiringUnits}</p>
            <p className="text-sm text-muted-foreground mt-2">Units expiring within 7 days</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Blood Type Distribution</h3>
          <div className="h-[200px]">
            <Chart 
              type="bar"
              data={bloodTypeDistribution}
              categories={['value']}
              index="name"
              colors={['#ef4444']}
              valueFormatter={(value) => `${value} units`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
