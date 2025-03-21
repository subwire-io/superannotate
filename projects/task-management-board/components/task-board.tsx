"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import TaskColumn from "./task-column"
import AddTaskDialog from "./add-task-dialog"
import type { Task, Column } from "@/types/task"

export default function TaskBoard() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "inProgress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ])
  const [deletedTasks, setDeletedTasks] = useState<{ task: Task; columnId: string }[]>([])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskBoard")
    if (savedTasks) {
      try {
        setColumns(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Failed to parse saved tasks", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("taskBoard", JSON.stringify(columns))
  }, [columns])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) return

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Find source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new arrays to avoid mutating state directly
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    // Same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [movedTask] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, movedTask)

      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: newTasks,
      }
    } else {
      // Different columns
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [movedTask] = sourceTasks.splice(source.index, 1)

      // Update the status of the task to match the new column
      const updatedTask = { ...movedTask, status: destColumn.id }
      destTasks.splice(destination.index, 0, updatedTask)

      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: sourceTasks,
      }

      newColumns[destColIndex] = {
        ...destColumn,
        tasks: destTasks,
      }
    }

    setColumns(newColumns)
    toast({
      title: "Task moved",
      description: "Task has been moved successfully",
    })
  }

  const addTask = (task: Task) => {
    const newColumns = [...columns]
    const columnIndex = newColumns.findIndex((col) => col.id === task.status)

    if (columnIndex !== -1) {
      newColumns[columnIndex].tasks.push(task)
      setColumns(newColumns)
      toast({
        title: "Task added",
        description: "New task has been added successfully",
      })
    }
  }

  const deleteTask = (taskId: string, columnId: string) => {
    const newColumns = [...columns]
    const columnIndex = newColumns.findIndex((col) => col.id === columnId)

    if (columnIndex !== -1) {
      // Find the task before removing it
      const taskToDelete = newColumns[columnIndex].tasks.find((task) => task.id === taskId)

      if (taskToDelete) {
        // Store the deleted task for potential undo
        setDeletedTasks([...deletedTasks, { task: taskToDelete, columnId }])

        // Remove the task from the column
        newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.filter((task) => task.id !== taskId)

        setColumns(newColumns)

        // Show toast with undo button
        toast({
          title: "Task deleted",
          description: "Task has been deleted",
          action: (
            <Button variant="outline" size="sm" onClick={() => undoDelete()} className="hover:bg-primary/10">
              Undo
            </Button>
          ),
        })
      }
    }
  }

  const undoDelete = () => {
    if (deletedTasks.length > 0) {
      const lastDeleted = deletedTasks[deletedTasks.length - 1]
      const newColumns = [...columns]
      const columnIndex = newColumns.findIndex((col) => col.id === lastDeleted.columnId)

      if (columnIndex !== -1) {
        newColumns[columnIndex].tasks.push(lastDeleted.task)
        setColumns(newColumns)

        // Remove the restored task from deletedTasks
        setDeletedTasks(deletedTasks.slice(0, -1))

        toast({
          title: "Task restored",
          description: "Task has been restored successfully",
        })
      }
    }
  }

  const updateTask = (updatedTask: Task) => {
    const newColumns = [...columns]

    // Find the column containing the task
    const columnIndex = newColumns.findIndex((col) => col.tasks.some((task) => task.id === updatedTask.id))

    if (columnIndex !== -1) {
      // Update the task in its current column
      newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      )

      setColumns(newColumns)
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      })
    }
  }

  // Filter tasks based on search query
  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  const hasSearchResults = filteredColumns.some((column) => column.tasks.length > 0)

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Management Board</h1>
          <Button onClick={() => setIsAddTaskOpen(true)} className="transition-all duration-200 hover:scale-105">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="w-full max-w-sm">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          {searchQuery && !hasSearchResults && (
            <div className="w-full p-8 text-center border rounded-md border-dashed border-muted-foreground/50 text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredColumns.map((column) => (
              <TaskColumn key={column.id} column={column} deleteTask={deleteTask} updateTask={updateTask} />
            ))}
          </div>
        </DragDropContext>
      </div>

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} onAddTask={addTask} />
    </div>
  )
}

