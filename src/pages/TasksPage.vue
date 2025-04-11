<template>
  <q-page padding>
    <h4 class="q-mb-md text-bold">Manage Assessment Tasks</h4>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-select v-model="complexityFilter" :options="complexityLevels" label="Filter by Complexity" />
      </div>
      <div class="col-12 col-md-4">
        <q-select v-model="areaFilter" :options="assessmentAreas" label="Filter by Area" />
      </div>
      <div class="col-12 col-md-4">
        <q-select v-model="sortBy" :options="sortOptions" label="Sort by" />
      </div>
    </div>

    <!-- Expert Management Dialog -->
    <q-dialog v-model="expertDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingExpert ? 'Edit Expert' : 'New Expert' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="currentExpert.name" label="Name" :rules="[val => !!val || 'Name is required']" />
          <q-select
            v-model="currentExpert.specialization"
            :options="assessmentAreas"
            label="Specialization"
            :rules="[val => !!val || 'Specialization is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveExpert" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Task Dialog -->
    <q-dialog v-model="taskDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingTask ? 'Edit Task' : 'New Task' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="currentTask.title"
            label="Title"
            :rules="[val => !!val || 'Title is required']"
            class="q-mb-md"
          />
          <q-input
            v-model="currentTask.description"
            label="Description"
            type="textarea"
            class="q-mb-md"
          />
          <q-select
            v-model="currentTask.complexity"
            :options="complexityLevels"
            label="Complexity Level"
            class="q-mb-md"
          />
          <q-input
            v-model.number="currentTask.estimatedHours"
            label="Estimated Hours"
            type="number"
            class="q-mb-md"
          />
          <q-select
            v-model="currentTask.assessmentArea"
            :options="assessmentAreas"
            label="Assessment Area"
            class="q-mb-md"
          />
          <q-select
            v-model="currentTask.requiredExpertise"
            :options="assessmentAreas"
            label="Required Expertise"
            multiple
            class="q-mb-md"
          />
          <q-select
            v-model="currentTask.prerequisites"
            :options="availablePrerequisites"
            label="Prerequisites"
            multiple
            option-label="title"
            option-value="id"
            class="q-mb-md"
          >
            <template v-slot:option="{ itemProps, opt }">
              <q-item v-bind="itemProps">
                <q-item-section>
                  <q-item-label>{{ opt.title }}</q-item-label>
                  <q-item-label caption>{{ opt.assessmentArea }} - {{ opt.complexity }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-col-gutter-md">
      <div v-for="task in filteredAndSortedTasks" :key="task.id" class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">{{ task.title }}</div>
              <div>
                <q-btn flat round icon="edit" @click="editTask(task)" />
                <q-btn flat round icon="delete" color="negative" @click="confirmDelete(task)" />
              </div>
            </div>
            <div class="text-subtitle2">{{ task.description }}</div>
            <div class="row items-center q-gutter-x-md q-mt-sm">
              <q-badge :color="getComplexityColor(task.complexity)">
                {{ task.complexity }}
              </q-badge>
              <q-badge color="primary">
                {{ task.assessmentArea }}
              </q-badge>
              <q-badge color="secondary">
                {{ task.estimatedHours }}h
              </q-badge>
            </div>
            <div v-if="task.assignedExperts.length" class="q-mt-sm">
              <div class="text-caption">Assigned Experts:</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="expert in task.assignedExperts"
                  :key="expert.id"
                  size="sm"
                  removable
                  @remove="removeExpertFromTask(task.id, expert.id)"
                >
                  {{ expert.name }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn-dropdown flat color="primary" label="Assign Expert">
              <q-list>
                <q-item
                  v-for="expert in getAvailableExperts(task)"
                  :key="expert.id"
                  clickable
                  v-close-popup
                  @click="assignExpertToTask(task.id, expert.id)"
                >
                  <q-item-section>
                    <q-item-label>{{ expert.name }}</q-item-label>
                    <q-item-label caption>{{ expert.specialization }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="fixed-bottom-right q-px-xl q-py-md">
      <q-fab
        icon="add"
        color="primary"
        direction="up"
      >
        <q-fab-action
          color="secondary"
          icon="person_add"
          label="Add Expert"
          @click="openNewExpertDialog"
        />
        <q-fab-action
          color="primary"
          icon="assignment_add"
          label="Add Task"
          @click="openNewTaskDialog"
        />
      </q-fab>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from 'src/stores/taskStore'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const taskStore = useTaskStore()
const { tasks, experts } = storeToRefs(taskStore)

const taskDialog = ref(false)
const expertDialog = ref(false)
const editingTask = ref(null)
const editingExpert = ref(null)
const complexityFilter = ref('all')
const areaFilter = ref('all')
const sortBy = ref({ label: 'Created Date', value: 'createdAt' })

const complexityLevels = ['Basic', 'Intermediate', 'Advanced', 'Expert']
const assessmentAreas = [
  'Structures',
  'Aerodynamics',
  'Propulsion',
  'Avionics',
  'Materials',
  'Systems integration',
  'Flight testing',
  'Certification'
]

const sortOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Complexity', value: 'complexity' },
  { label: 'Assessment Area', value: 'assessmentArea' },
  { label: 'Estimated Hours', value: 'estimatedHours' }
]

const currentTask = ref({
  title: '',
  description: '',
  complexity: 'basic',
  estimatedHours: 0,
  requiredExpertise: [],
  assignedExperts: [],
  prerequisites: [],
  assessmentArea: ''
})

const currentExpert = ref({
  name: '',
  specialization: ''
})

const availablePrerequisites = computed(() => {
  if (!editingTask.value) return tasks.value
  return tasks.value.filter(task => task.id !== editingTask.value.id)
})

const filteredAndSortedTasks = computed(() => {
  let filtered = [...tasks.value]

  if (complexityFilter.value !== 'all') {
    filtered = filtered.filter(task => task.complexity === complexityFilter.value)
  }

  if (areaFilter.value !== 'all') {
    filtered = filtered.filter(task => task.assessmentArea === areaFilter.value)
  }

  return taskStore.getSortedTasks(sortBy.value.value)
})

const resetCurrentTask = () => {
  currentTask.value = {
    title: '',
    description: '',
    complexity: 'basic',
    estimatedHours: 0,
    requiredExpertise: [],
    assignedExperts: [],
    prerequisites: [],
    assessmentArea: ''
  }
}

const resetCurrentExpert = () => {
  currentExpert.value = {
    name: '',
    specialization: ''
  }
}

const openNewTaskDialog = () => {
  editingTask.value = null
  resetCurrentTask()
  taskDialog.value = true
}

const openNewExpertDialog = () => {
  editingExpert.value = null
  resetCurrentExpert()
  expertDialog.value = true
}

const editTask = (task) => {
  editingTask.value = task
  currentTask.value = { ...task }
  taskDialog.value = true
}

const editExpert = (expert) => {
  editingExpert.value = expert
  currentExpert.value = { ...expert }
  expertDialog.value = true
}

const saveTask = () => {
  if (!currentTask.value.title) {
    $q.notify({
      color: 'negative',
      message: 'Title is required'
    })
    return
  }

  // Ensure arrays are initialized
  const taskToSave = {
    ...currentTask.value,
    assignedExperts: currentTask.value.assignedExperts || [],
    requiredExpertise: currentTask.value.requiredExpertise || [],
    prerequisites: currentTask.value.prerequisites || []
  }

  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, taskToSave)
  } else {
    taskStore.addTask(taskToSave)
  }

  taskDialog.value = false
  resetCurrentTask()
}

const saveExpert = () => {
  if (!currentExpert.value.name || !currentExpert.value.specialization) {
    $q.notify({
      color: 'negative',
      message: 'Name and specialization are required'
    })
    return
  }

  if (editingExpert.value) {
    taskStore.updateExpert(editingExpert.value.id, currentExpert.value)
  } else {
    taskStore.addExpert(currentExpert.value)
  }

  expertDialog.value = false
  resetCurrentExpert()
}

const confirmDelete = (task) => {
  $q.notify({
    message: 'Delete this task?',
    color: 'negative',
    position: 'center',
    timeout: 0,
    actions: [
      { label: 'Cancel', color: 'white' },
      {
        label: 'Delete',
        color: 'white',
        handler: () => {
          taskStore.deleteTask(task.id)
        }
      }
    ]
  })
}

const getComplexityColor = (complexity) => ({
  basic: 'green',
  intermediate: 'blue',
  advanced: 'orange',
  expert: 'red'
}[complexity])

const getAvailableExperts = (task) => {
  return experts.value.filter(expert => {
    const hasRequiredExpertise = task.requiredExpertise.includes(expert.specialization)
    const isNotAssigned = !task.assignedExperts?.some(assigned => assigned.id === expert.id)
    return hasRequiredExpertise && isNotAssigned
  })
}

const assignExpertToTask = (taskId, expertId) => {
  taskStore.assignExpertToTask(taskId, expertId)
}

const removeExpertFromTask = (taskId, expertId) => {
  taskStore.removeExpertFromTask(taskId, expertId)
}
</script>
