<template>
  <div class="BacklogItemCard row w-100 m-0 my-3 justify-content-between d-flex border border-dark bg-info CardShadowing shrink">
    <div class="col-md-4 p-2">
      <div class="row w-100 m-0">
        <div class="col-md-2 p-0  rounded-pill w-100" :style="`background-color: ${backlogItem.color}`">
        </div>
        <div class="col-md-8 p-0 d-flex align-items-center">
          <h5 class="p-2">
            {{ backlogItem.name }}
          </h5>
        </div>
        <div class="col-md-2 p-0 d-flex justify-content-around align-items-center">
          <h5 class="weight-text p-0">
            {{ taskWeight }}
          </h5>
          <i class="fas fa-weight-hanging fa-2x"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4 p-2 d-flex align-items-center">
      <div class="row w-100 m-0 d-flex align-items-center ">
        <div class="col-12 p-0 d-flex align-items-center justify-content-between">
          <button class="btn btn-outline-warning " data-toggle="modal" data-target="#taskModal">
            Task +
          </button>
          <h5><span>{{ taskComplete }}</span> Tasks Complete</h5>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade"
       id="taskModal"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Create New Task
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createBacklogItem">
            <div class="form-group">
              <label for="name">Task Name</label>
              <input type="text"
                     v-model="stateCreateTask.createTask.name"
                     placeholder="Name..."
                     id="name"
                     name="name"
                     class="form-control"
              >
              <label for="weight" class="">Weight </label>
              <input class="mb-2 ml-2"
                     type="number"
                     name="weight"
                     id="weight"
                     v-model="stateCreateTask.createTask.weight"
                     placeholder="0"
              >
            </div>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="submit" class="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from '@vue/runtime-core'
import Pop from '../utils/Notifier'
import { backlogItemsService } from '../services/BacklogItemsService'
import { AppState } from '../AppState'
import { tasksService } from '../services/TasksService'

export default {
  name: 'BacklogItemCard',
  props: {
    backlogItem: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    onMounted(async() => {
      try {
        await backlogItemsService.getAllTasksIn(props.backlogItem.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    })
    const stateTasks = {
      tasks: AppState.tasks
    }
    const stateCreateTask = reactive({
      createTask: {}
    })
    return {
      stateTasks,
      stateCreateTask,
      async createTask() {
        try {
          stateCreateTask.createTask.creatorId = AppState.account.id
          stateCreateTask.createTask.projectId = props.backlogItem.projectId
          await tasksService.createTask(stateCreateTask.createTask)
          await backlogItemsService.getAllTasksIn(props.backlogItem.id)
          stateTasks.tasks = AppState.tasks
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      taskWeight: computed(() => {
        let summer = 0
        stateTasks.tasks.forEach(t => (summer += t.weight))
        return summer
      }),
      taskComplete: computed(() => {
        const totalTasks = stateTasks.tasks.length
        let summer = 0
        stateTasks.tasks.forEach(t => {
          if (!t.isOpen) {
            summer++
          }
        })
        return summer + '/' + totalTasks
      })
    }
  }
}
</script>

<style scoped lang="scss">
.roundedButton {
  border-radius: 50%;
}

.exampleBack {
  background-color: red($color: #df1d1d);
}

.fa-weight-hanging {
color: #9bf709
}
.weight-text {
  color: #9bf709
}
.CardShadowing {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
}
.shrink {
transition: all .3s ease-in-out;
}
.shrink:hover {
transform: scale(0.99);
}
</style>
