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
          <button class="btn btn-outline-warning " data-toggle="modal" :data-target="'#taskModal'+backlogItem.id">
            Task +
          </button>
          <h5><span>{{ taskComplete }}</span> Tasks Complete</h5>
          <button class="btn btn-outline-warning " @click="removeBacklogItem">
            -
          </button>
        </div>
        <div class="col-md-12 p-0">
          <button type="button"
                  class="btn btn-outline-success"
                  data-toggle="collapse"
                  :data-target="'#expand'+backlogItem.id"
                  :aria-controls="'expand'+backlogItem.id"
          >
            All Tasks
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-12 collapse" :id="'expand'+backlogItem.id">
      <TaskCard v-for="t in tasks" :key="t" :task="t" />
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade"
       :id="'taskModal'+backlogItem.id"
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
          <form @submit.prevent="createTask">
            <div class="form-group">
              <label :for="'name'+backlogItem.id">Task Name</label>
              <input type="text"
                     v-model="stateCreateTask.createTask.name"
                     placeholder="Name..."
                     :id="'name'+backlogItem.id"
                     :name="'name'+backlogItem.id"
                     class="form-control"
              >
              <label for="'weight'+backlogItem.id" class="">Weight </label>
              <input class="mb-2 ml-2"
                     type="number"
                     :name="'weight'+backlogItem.id"
                     :id="'weight'+backlogItem.id"
                     v-model="stateCreateTask.createTask.weight"
                     placeholder="0"
              ><br>
              <label :for="'sprintId'+backlogItem.id">Task for Sprint:   </label>
              <select v-model="stateCreateTask.createTask.sprintId" :name="'sprintId'+backlogItem.id" :id="'sprintId'+backlogItem.id">
                <option selected value="unassigned">
                  unassigned
                </option>
                <option v-for="s in sprintsIn" :key="s" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
              <br>
              <label :for="'tastStatus'+backlogItem.id">Task Status:</label>
              <select v-model="stateCreateTask.createTask.status" :name="'tastStatus'+backlogItem.id" id="'tastStatus'+backlogItem.id">
                <option v-if="stateCreateTask.createTask.status !== 'pending'" value="pending">
                  pending
                </option>
                <option v-if="stateCreateTask.createTask.status !== 'in-progress'" value="in-progress">
                  in-progres
                </option>
                <option v-if="stateCreateTask.createTask.status !== 'review'" value="review">
                  review
                </option>
                <option v-if="stateCreateTask.createTask.status !== 'done'" value="done">
                  done
                </option>
              </select>
              <label :for="'tastStatus'+backlogItem.id">currentStatus: {{ stateCreateTask.createTask.status }}</label>
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
import $ from 'jquery'
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import Pop from '../utils/Notifier'
import { backlogItemsService } from '../services/BacklogItemsService'
import { AppState } from '../AppState'
import { tasksService } from '../services/TasksService'
import { logger } from '../utils/Logger'

export default {
  name: 'BacklogItemCard',
  props: {
    backlogItem: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // REVIEW YOU SHOULD HAVE KNOW REFS YOU SIMPLETON
    const tasks = ref([AppState.tasks])

    onMounted(async() => {
      try {
        await backlogItemsService.getAllTasksIn(props.backlogItem.id)
        // logger.log('This is the Mount Tasks', AppState.tasks)
        tasks.value = [...AppState.tasks]
        // logger.log('This is the State Tasks in mount', tasks.value)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    })

    // logger.log('This is the Setup Tasks', tasks.value)
    const stateCreateTask = reactive({
      createTask: {
        status: 'pending'
      }
    })
    // logger.log('End of Card Setup: pop value', props.backlogItem)
    return {
      props,
      tasks,
      stateCreateTask,
      async createTask() {
        try {
          stateCreateTask.createTask.projectId = props.backlogItem.projectId
          stateCreateTask.createTask.creatorId = AppState.account.id
          // logger.log('BacklogItem id in use', props.backlogItem.id)
          stateCreateTask.createTask.backlogItemId = props.backlogItem.id
          stateCreateTask.createTask.weight = parseInt(stateCreateTask.createTask.weight)
          await tasksService.createTask(stateCreateTask.createTask)
          await backlogItemsService.getAllTasksIn(props.backlogItem.id)
          tasks.value = AppState.tasks
          stateCreateTask.createTask = {
            status: 'pending'
          }
          $(('#taskModal' + props.backlogItem.id)).modal('hide')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      taskWeight: computed(() => {
        let summer = 0
        tasks.value.forEach(t => (summer += parseInt(t.weight)))
        return summer
      }),
      taskComplete: computed(() => {
        const totalTasks = tasks.value.length
        let summer = 0
        tasks.value.forEach(t => summer++)
        return summer + '/' + totalTasks
      }),
      sprintsIn: computed(() => AppState.sprints),
      async removeBacklogItem() {
        try {
          await backlogItemsService.removeBacklogItem(props.backlogItem.id)
          Pop.toast('Deleted BacklogItem', 'success')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }
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
