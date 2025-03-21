"use client"

import { Droppable } from "react-beautiful-dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import TaskCard from "./task-card"
import type { Column, Task } from "@/types/task"

interface TaskColumnProps {
  column: Column
  deleteTask: (taskId: string, columnId: string) => void
  updateTask: (task: Task) => void
}

export default function TaskColumn({ column, deleteTask, updateTask }: TaskColumnProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{column.title}</CardTitle>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {column.tasks.length}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`min-h-[500px] rounded-md transition-colors ${
                snapshot.isDraggingOver ? "bg-primary/10" : "hover:bg-secondary/50"
              }`}
            >
              {column.tasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-md border-muted-foreground/50 text-muted-foreground">
                  No tasks
                </div>
              ) : (
                <div className="space-y-2">
                  {column.tasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      columnId={column.id}
                    />
                  ))}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}

