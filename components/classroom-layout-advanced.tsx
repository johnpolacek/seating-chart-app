'use client'

import { ClassPeriod, Student } from './types'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, PlusCircle, UserPlus, Trash2 } from 'lucide-react'

const initialClassPeriods: ClassPeriod[] = [
  {
    number: 1,
    rows: [
      {
        pods: [{ students: [] }]
      }
    ],
    unassignedStudents: [],
  }
]

export function ClassroomLayoutAdvanced() {
  const [classPeriods, setClassPeriods] = useState<ClassPeriod[]>(initialClassPeriods)
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState<number | null>(0)
  const [newStudentName, setNewStudentName] = useState('')
  const [newPeriodName, setNewPeriodName] = useState('')
  const [selectedRowForNewPod, setSelectedRowForNewPod] = useState<number | null>(null)
  const [isAddingNewPeriod, setIsAddingNewPeriod] = useState<boolean>(false)

  // Get the currently selected period
  const currentPeriod = currentPeriodIndex !== null ? classPeriods[currentPeriodIndex] : null

  // Add a new student to the unassignedStudents of the current period
  const addNewStudent = () => {
    if (newStudentName.trim() && currentPeriodIndex !== null) {
      const newStudent: Student = { id: Date.now(), name: newStudentName.trim() }
      setClassPeriods(currentPeriods => 
        currentPeriods.map((period, index) => 
          index === currentPeriodIndex
            ? { ...period, unassignedStudents: [...period.unassignedStudents, newStudent] }
            : period
        )
      )
      setNewStudentName('')
    }
  }

  // Remove a student from the unassignedStudents of the current period
  const removeUnassignedStudent = (studentId: number) => {
    if (currentPeriodIndex === null) return
    setClassPeriods(currentPeriods => 
      currentPeriods.map((period, index) => 
        index === currentPeriodIndex
          ? { ...period, unassignedStudents: period.unassignedStudents.filter(student => student.id !== studentId) }
          : period
      )
    )
  }

  // Add a new pod to a selected row in the current period
  const addNewPod = () => {
    if (selectedRowForNewPod === null || currentPeriodIndex === null) return

    setClassPeriods(currentPeriods => 
      currentPeriods.map((period, index) => 
        index === currentPeriodIndex
          ? {
              ...period,
              rows: period.rows.map((row, rowIdx) => 
                rowIdx === selectedRowForNewPod
                  ? { ...row, pods: [...row.pods, { students: [] }] }
                  : row
              )
            }
          : period
      )
    )
    setSelectedRowForNewPod(null)
  }

  // Delete a pod from a specific row in the current period
  const deletePod = (rowIndex: number, podIndex: number) => {
    if (currentPeriodIndex === null) return
    setClassPeriods(currentPeriods => 
      currentPeriods.map((period, index) => 
        index === currentPeriodIndex
          ? {
              ...period,
              rows: period.rows.map((row, rIdx) => 
                rIdx === rowIndex
                  ? {
                      ...row,
                      pods: row.pods.filter((_, pIdx) => pIdx !== podIndex)
                    }
                  : row
              ),
              unassignedStudents: [
                ...period.unassignedStudents,
                ...(period.rows[rowIndex]?.pods[podIndex]?.students || [])
              ]
            }
          : period
      )
    )
  }

  // Add a new row to the current period
  const addNewRow = () => {
    if (currentPeriodIndex === null) return
    setClassPeriods(currentPeriods => 
      currentPeriods.map((period, index) => 
        index === currentPeriodIndex
          ? {
              ...period,
              rows: [
                ...period.rows,
                { pods: [{ students: [] }] }
              ]
            }
          : period
      )
    )
  }

  // Add a student to a specific pod in a specific row
  const addStudentToPod = (rowIndex: number, podIndex: number, studentId: number) => {
    if (currentPeriodIndex === null) return
    setClassPeriods(currentPeriods => 
      currentPeriods.map((period, index) => {
        if (index === currentPeriodIndex) {
          const studentToMove = period.unassignedStudents.find(s => s.id === studentId)
          if (studentToMove) {
            return {
              ...period,
              rows: period.rows.map((row, rIdx) => 
                rIdx === rowIndex
                  ? {
                      ...row,
                      pods: row.pods.map((pod, pIdx) => 
                        pIdx === podIndex 
                          ? { ...pod, students: [...pod.students, studentToMove] }
                          : pod
                      )
                    }
                  : row
              ),
              unassignedStudents: period.unassignedStudents.filter(s => s.id !== studentId)
            }
          }
        }
        return period
      })
    )
  }

  // Add a new period to the classPeriods array
  const addNewPeriod = () => {
    if (newPeriodName.trim()) {
      const newPeriod: ClassPeriod = {
        number: classPeriods.length + 1,
        rows: [{ pods: [{ students: [] }] }],
        unassignedStudents: [],
      }
      setClassPeriods(current => [...current, newPeriod])
      setNewPeriodName('')
      setIsAddingNewPeriod(false)
      setCurrentPeriodIndex(classPeriods.length) // Select the newly added period
    }
  }

  // Handle selection changes in the period dropdown
  const handleSelectChange = (value: string) => {
    if (value === 'add-new') {
      setIsAddingNewPeriod(true)
      setCurrentPeriodIndex(null)
    } else {
      setIsAddingNewPeriod(false)
      setCurrentPeriodIndex(Number(value))
    }
  }

  // Render a single pod
  const renderPod = (rowIndex: number, podIndex: number) => {
    const pod = currentPeriod?.rows[rowIndex].pods[podIndex]
    const podNumber = podIndex + 1

    return (
      <Card key={`${rowIndex}-${podIndex}`} className="p-4 flex flex-col h-full">
        <CardContent className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Pod {podNumber}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => deletePod(rowIndex, podIndex)}
              aria-label={`Delete Pod ${podNumber}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {[...Array(9)].map((_, idx) => {
              const isCenter = idx === 4
              const adjustedIndex = idx > 4 ? idx - 1 : idx
              const student = pod?.students[adjustedIndex]

              if (isCenter) {
                return <div key={idx} className="bg-gray-200 rounded"></div>
              }

              if (!currentPeriod) {
                return null
              }

              return (
                <div key={idx} className="aspect-square flex items-center justify-center border rounded">
                  {student ? (
                    <span className="text-sm text-center">{student.name}</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-full w-full"
                      onClick={() => addStudentToPod(rowIndex, podIndex, currentPeriod.unassignedStudents[0]?.id)}
                      disabled={currentPeriod.unassignedStudents.length === 0}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Classroom Seating Chart</h1>
      
      {/* Period Selection and Adding New Period */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
        <Select 
          value={currentPeriodIndex !== null ? currentPeriodIndex.toString() : 'add-new'} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {classPeriods.map((period, index) => (
              <SelectItem key={index} value={index.toString()}>Period {period.number}</SelectItem>
            ))}
            <SelectItem value="add-new">Add New Period</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isAddingNewPeriod && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 w-full max-w-2xl">
            <Input 
              type="text" 
              placeholder="Period Number" 
              value={newPeriodName} 
              onChange={(e) => setNewPeriodName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addNewPeriod}>Add Period</Button>
            <Button 
              onClick={() => { 
                setIsAddingNewPeriod(false)
                setNewPeriodName('')
                setCurrentPeriodIndex(0)
              }} 
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        )}
      
      {currentPeriod && (
        <>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <Input 
              type="text" 
              placeholder="New student name" 
              value={newStudentName} 
              onChange={(e) => setNewStudentName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addNewStudent}>Add Student</Button>
            <Select 
              value={selectedRowForNewPod !== null ? selectedRowForNewPod.toString() : ''} 
              onValueChange={(value) => setSelectedRowForNewPod(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select row for new pod" />
              </SelectTrigger>
              <SelectContent>
                {currentPeriod.rows.map((_, rowIdx) => (
                  <SelectItem key={rowIdx} value={rowIdx.toString()}>Row {rowIdx + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addNewPod} disabled={selectedRowForNewPod === null}>Add Pod</Button>
            <Button onClick={addNewRow} variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>
          
          {/* Rendering Rows and Pods */}
          {currentPeriod.rows.map((row, rowIdx) => (
            <div key={rowIdx} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Row {rowIdx + 1}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {row.pods.map((_, podIdx) => renderPod(rowIdx, podIdx))}
              </div>
            </div>
          ))}
          
          {/* Unassigned Students */}
          <Card className="p-4 mt-4">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">Unassigned Students</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {currentPeriod.unassignedStudents.length > 0 ? (
                  currentPeriod.unassignedStudents.map((student) => (
                    <div key={student.id} className="bg-gray-100 p-2 rounded text-sm flex justify-between items-center">
                      {student.name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeUnassignedStudent(student.id)}
                        aria-label={`Remove ${student.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic py-4 col-span-full text-center">No unassigned students</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Informational Messages */}
      {!currentPeriod && classPeriods.length > 0 && !isAddingNewPeriod && (
        <p className="mt-4 text-center text-gray-500">Please select a period or add a new one.</p>
      )}

      {classPeriods.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No class periods available. Please add a new period to get started.</p>
      )}
    </div>
  )
}
