"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Task } from "@/types/task"
import EditTaskDialog from "./edit-task-dialog"
import AlertDialogDelete from "./alert-dialog-delete"

interface TaskCardProps {
  task: Task
  index: number
  columnId: string
  deleteTask: (taskId: string, columnId: string) => void
  updateTask: (task: Task) => void
  isMobileView?: boolean
  onDragStart: (task: Task, columnId: string) => void
  onDragEnd: () => void
  isDragging: boolean
}

export default function TaskCard({
  task,
  index,
  columnId,
  deleteTask,
  updateTask,
  isMobileView = false,
  onDragStart,
  onDragEnd,
  isDragging,
}: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"

    // Add a delay to allow the drag image to be set
    setTimeout(() => {
      onDragStart(task, columnId)
    }, 0)
  }

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        className={`task-card-wrapper ${isDragging ? "opacity-50" : ""}`}
      >
        <Card
          className={`transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] hover:border-primary/50 touch-manipulation ${
            isMobileView ? "scale-100 active:scale-[0.98]" : ""
          } ${isDragging ? "shadow-lg" : ""}`}
        >
          <CardContent className={`${isMobileView ? "p-2" : "p-3"}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${isMobileView ? "text-sm" : ""}`}>{task.title}</h3>
                <div className="flex items-center space-x-1">
                  {getPriorityIcon()}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobileView ? "h-6 w-6" : "h-8 w-8 sm:h-7 sm:w-7"}`}
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit task</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isMobileView ? "h-6 w-6" : "h-8 w-8 sm:h-7 sm:w-7"
                    } text-destructive hover:bg-destructive/10 transition-colors`}
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
              <p
                className={`${isMobileView ? "text-xs" : "text-sm"} text-muted-foreground line-clamp-${
                  isMobileView ? "1" : "2"
                }`}
              >
                {task.description}
              </p>
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditTaskDialog open={isEditOpen} onOpenChange={setIsEditOpen} task={task} onUpdateTask={updateTask} />
      <AlertDialogDelete
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskTitle={task.title}
        onConfirm={() => {
          deleteTask(task.id, columnId)
          setIsDeleteDialogOpen(false)
        }}
      />
    </>
  )
}

