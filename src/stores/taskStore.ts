import { defineStore } from 'pinia'

interface Expert {
  id: string
  name: string
  specialization: string
}

export type ComplexityLevel = 'basic' | 'intermediate' | 'advanced' | 'expert'

interface Task {
  id: string
  title: string
  description: string
  complexity: ComplexityLevel
  estimatedHours: number
  requiredExpertise: string[]
  assignedExperts: Expert[]
  prerequisites: string[] // IDs of tasks that must be completed before this one
  assessmentArea: string // e.g., 'structures', 'aerodynamics', 'propulsion', 'avionics'
  createdAt: Date
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    experts: [
      { id: '1', name: 'John Smith', specialization: 'Structures' },
      { id: '2', name: 'Sarah Johnson', specialization: 'Aerodynamics' },
      { id: '3', name: 'Michael Chen', specialization: 'Propulsion' },
      { id: '4', name: 'Rebecca Taylor', specialization: 'Avionics' },
      { id: '5', name: 'David Wilson', specialization: 'Materials' }
    ] as Expert[]
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id: string) => state.tasks.find(task => task.id === id),
    getExperts: (state) => state.experts,
    getTasksByComplexity: (state) => (complexity: ComplexityLevel) =>
      state.tasks.filter(task => task.complexity === complexity),
    getTasksByArea: (state) => (area: string) =>
      state.tasks.filter(task => task.assessmentArea === area),
    getTasksByExpertise: (state) => (expertise: string) =>
      state.tasks.filter(task => task.requiredExpertise.includes(expertise)),
    getSortedTasks: (state) => (sortBy: keyof Task = 'createdAt', ascending = false) =>
      [...state.tasks].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue instanceof Date && bValue instanceof Date) {
          return ascending ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        }
        return ascending
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }),
    getAvailableExpertsByExpertise: (state) => (expertise: string) =>
      state.experts.filter(expert => expert.specialization === expertise)
  },

  actions: {
    addTask(task: Omit<Task, 'id' | 'createdAt'>) {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date()
      }
      this.tasks.push(newTask)
    },

    updateTask(taskId: string, updates: Partial<Task>) {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates }
      }
    },

    deleteTask(taskId: string) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
    },

    addExpert(expert: Omit<Expert, 'id'>) {
      const newExpert: Expert = {
        ...expert,
        id: crypto.randomUUID()
      }
      this.experts.push(newExpert)
    },

    updateExpert(expertId: string, updates: Partial<Expert>) {
      const expertIndex = this.experts.findIndex(expert => expert.id === expertId)
      if (expertIndex !== -1) {
        this.experts[expertIndex] = { ...this.experts[expertIndex], ...updates }
      }
    },

    deleteExpert(expertId: string) {
      this.experts = this.experts.filter(expert => expert.id !== expertId)
    },

    assignExpertToTask(taskId: string, expertId: string) {
      const task = this.tasks.find(t => t.id === taskId)
      const expert = this.experts.find(e => e.id === expertId)

      if (task && expert) {
        if (!task.assignedExperts.some(e => e.id === expertId)) {
          task.assignedExperts.push(expert)
        }
      }
    },

    removeExpertFromTask(taskId: string, expertId: string) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.assignedExperts = task.assignedExperts.filter(e => e.id !== expertId)
      }
    }
  }
})
