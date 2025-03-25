"use client"

import type React from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import TaskCard from "./task-card"
import type { Column, Task } from "@/types/task"

interface TaskColumnProps {
  column: Column
  deleteTask: (taskId: string, columnId: string) => void
  updateTask: (task: Task) => void
  isMobileView?: boolean
  onDragStart: (task: Task, columnId: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, columnId: string) => void
  onDrop: (e: React.DragEvent, columnId: string, index?: number) => void
  draggedTask: { task: Task; columnId: string } | null
}

export default function TaskColumn({
  column,
  deleteTask,
  updateTask,
  isMobileView = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  draggedTask,
}: TaskColumnProps) {
  return (
    <Card className={`${isMobileView ? "shadow-sm" : "h-full"}`}>
      {!isMobileView && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{column.title}</CardTitle>
            <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {column.tasks.length}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={isMobileView ? "p-2" : "p-4"}>
        <div
          className={`task-list ${
            isMobileView ? "min-h-[80px]" : "min-h-[500px]"
          } rounded-md transition-colors hover:bg-secondary/50 ${
            draggedTask && draggedTask.columnId !== column.id ? "bg-primary/5" : ""
          }`}
          onDragOver={(e) => onDragOver(e, column.id)}
          onDrop={(e) => onDrop(e, column.id)}
        >
          {column.tasks.length === 0 ? (
            <div
              className={`flex items-center justify-center ${isMobileView ? "h-12 text-xs" : "h-24"} border border-dashed rounded-md border-muted-foreground/50 text-muted-foreground`}
              onDragOver={(e) => onDragOver(e, column.id)}
              onDrop={(e) => onDrop(e, column.id)}
            >
              No tasks
            </div>
          ) : (
            <div className={`task-items ${isMobileView ? "space-y-1" : "space-y-2"}`}>
              {column.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="task-drop-zone"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add("task-drop-zone-active")
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("task-drop-zone-active")
                  }}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove("task-drop-zone-active")
                    onDrop(e, column.id, index)
                  }}
                >
                  <TaskCard
                    task={task}
                    index={index}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    columnId={column.id}
                    isMobileView={isMobileView}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={draggedTask?.task.id === task.id}
                  />
                </div>
              ))}
              {/* Add a drop zone at the end of the list */}
              <div
                className="task-drop-zone-end"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add("task-drop-zone-active")
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("task-drop-zone-active")
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove("task-drop-zone-active")
                  onDrop(e, column.id)
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

