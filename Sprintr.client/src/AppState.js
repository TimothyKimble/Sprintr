import { reactive, ref } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  account: {},
  taskCopy: {},
  projects: [],
  backlogItems: [],
  sprints: [],
  tasks: [],
  notes: {}
})
