
import { Card, CardContent } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart-wrapper"
import { AlertCircle, TrendingUp, TrendingDown, ChartBar } from "lucide-react"

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Blood Units</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">{totalUnits}</p>
              <span className="text-sm text-muted-foreground">units</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Across all blood types</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Critical Stock</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">{criticalTypes.length}</p>
              <span className="text-sm text-muted-foreground">types</span>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <p className="text-sm text-muted-foreground">
                {criticalTypes.length > 0 
                  ? `Low: ${criticalTypes.join(', ')}` 
                  : 'All blood types at healthy levels'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-yellow-500">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <TrendingDown className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Expiring Soon</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">{expiringUnits}</p>
              <span className="text-sm text-muted-foreground">units</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Units expiring within 7 days</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3 hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-full mr-3">
              <ChartBar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Blood Type Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <Chart
              type="bar"
              data={bloodTypeDistribution}
              categories={['value']}
              index="name"
              colors={['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#6366f1']}
              valueFormatter={(value) => `${value} units`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
