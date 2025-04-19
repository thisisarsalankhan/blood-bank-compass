
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BloodComponentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export const BloodComponentForm = ({ open, onOpenChange, onSubmit }: BloodComponentFormProps) => {
  const [formData, setFormData] = useState({
    bloodType: '',
    component: '',
    units: '',
    location: '',
    source: '',
    donationDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({
      bloodType: '',
      component: '',
      units: '',
      location: '',
      source: '',
      donationDate: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Blood Component</DialogTitle>
          <DialogDescription>
            Add new blood components to the inventory system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="bloodType" className="text-sm font-medium">Blood Type</label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="component" className="text-sm font-medium">Component</label>
              <Select
                value={formData.component}
                onValueChange={(value) => setFormData({ ...formData, component: value })}
              >
                <SelectTrigger id="component">
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Whole Blood">Whole Blood</SelectItem>
                  <SelectItem value="Red Blood Cells">Red Blood Cells</SelectItem>
                  <SelectItem value="Plasma">Plasma</SelectItem>
                  <SelectItem value="Platelets">Platelets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="units" className="text-sm font-medium">Units</label>
            <Input
              id="units"
              type="number"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              placeholder="Number of units"
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Storage Location</label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Storage">Main Storage</SelectItem>
                <SelectItem value="Cold Storage 1">Cold Storage 1</SelectItem>
                <SelectItem value="Cold Storage 2">Cold Storage 2</SelectItem>
                <SelectItem value="Mobile Unit">Mobile Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="donationDate" className="text-sm font-medium">Donation Date</label>
            <Input
              id="donationDate"
              type="date"
              value={formData.donationDate}
              onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">Source</label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Donation drive, hospital, etc."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-bloodRed hover:bg-bloodRed/90">
            Add Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
