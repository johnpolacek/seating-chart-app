'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from '@/hooks/use-toast'

type FormData = {
  name: string;
  period: string;
  preferredPartner: string;
  nonPreferredPartner: string;
  preferredLocation: string;
}

const initialFormData: FormData = {
  name: '',
  period: '',
  preferredPartner: '',
  nonPreferredPartner: '',
  preferredLocation: '',
}

export function StudentPreferenceForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData)
    toast({
      title: "Preferences Submitted",
      description: "Your seating preferences have been recorded.",
    })
    setFormData(initialFormData) // Reset form after submission
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Seating Preference Form</CardTitle>
        <CardDescription>Please enter your seating preferences for the classroom.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Class Period</Label>
            <Select name="period" value={formData.period} onValueChange={handleSelectChange('period')}>
              <SelectTrigger>
                <SelectValue placeholder="Select your class period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Period 1</SelectItem>
                <SelectItem value="2">Period 2</SelectItem>
                <SelectItem value="3">Period 3</SelectItem>
                <SelectItem value="4">Period 4</SelectItem>
                <SelectItem value="5">Period 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredPartner">Preferred Seating Partner (Optional)</Label>
            <Input
              id="preferredPartner"
              name="preferredPartner"
              value={formData.preferredPartner}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nonPreferredPartner">Non-Preferred Seating Partner (Optional)</Label>
            <Input
              id="nonPreferredPartner"
              name="nonPreferredPartner"
              value={formData.nonPreferredPartner}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Location in Classroom</Label>
            <RadioGroup
              name="preferredLocation"
              value={formData.preferredLocation}
              onValueChange={handleSelectChange('preferredLocation')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="front" id="front" />
                <Label htmlFor="front">Front of the room</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="back" id="back" />
                <Label htmlFor="back">Back of the room</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left side</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right side</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center">Center of the room</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-preference" id="no-preference" />
                <Label htmlFor="no-preference">No preference</Label>
              </div>
            </RadioGroup>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full">Submit Preferences</Button>
      </CardFooter>
    </Card>
  )
}