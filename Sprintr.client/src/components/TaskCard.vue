<template>
  <div class="TaskCard row w-100 m-0 my-3 justify-content-between d-flex border border-dark bg-info CardShadowing shrink">
    <div class="col-md-4 p-2">
      <div class="row w-100 m-0">
        <div class="col-md-8 p-0 d-flex align-items-center">
          <h5 class="p-2">
            {{ task.name }}
          </h5>
        </div>
        <div class="col-md-2 p-0 d-flex justify-content-around align-items-center">
          <h5 class="weight-text p-0">
            {{ task.weight }}
          </h5>
          <i class="fas fa-weight-hanging fa-2x"></i>
        </div>
      </div>
    </div>
    <div class="col-md- p-2 d-flex align-items-center">
      <div class="row w-100 m-0 d-flex align-items-center ">
        <div class="col-12 p-0 d-flex align-items-center justify-content-between">
          <button class="btn btn-outline-warning " data-toggle="modal" :data-target="'#edit'+task.id">
            Edit
          </button>
          <button class="btn btn-outline-success " data-toggle="modal" :data-target="'#note'+task.id">
            Task +
          </button>
          <h5><span>{{ taskComplete }}</span> Tasks Complete</h5>
          <button class="btn btn-outline-warning " @click="removetask">
            -
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal for Edits -->
  <div class="modal fade"
       :id="'edit'+task.id"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Edit Task
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editTask">
            <div class="form-group">
              <label for="name">Task Name</label>
              <input type="text"
                     v-model="state.editCard.name"
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
                     placeholder="0"
                     v-model="state.editCard.weight"
              >
              <select v-model="state.editCard.status" name="taskStatus" id="taskStatus">
                <option>
                  pending
                </option>
                <option>
                  in-progress
                </option>
                <option>
                  review
                </option>
                <option>
                  done
                </option>
              </select>
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
  <!-- Modal for Notes -->
  <div class="modal fade"
       :id="'note'+task.id"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Add Note
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNote">
            <div class="form-group">
              <label for="body">Body</label>
              <input type="text"
                     v-model="state.editCard.name"
                     placeholder="Name..."
                     id="name"
                     name="name"
                     class="form-control"
              >
            </div>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="submit" class="btn btn-primary">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { reactive } from '@vue/reactivity'
import { tasksService } from '../services/TasksService'
import Pop from '../utils/Notifier'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'

export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      editCard: props.task,
      actualCard: props.task,
      createNote: {}
    },
    logger.log('task Prop :', props.task)
    )
    return {
      state,
      async editTask() {
        try {
          logger.log(state.editCard.creatorId, AppState.account.id)
          await tasksService.editTask(state.editCard)
          state.actualCard = state.editCard
          $('#edit').modal('hide')
          Pop.toast('You edited your task', 'succes')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      async addNote() {
        try {
          state.createNote.creatorId = AppState.account.id
          state.createNote.taskId = props.task
          await tasksService.addNote(state.createNote)
          state.actualCard = state.editCard
          $('#addNote').modal('hide')
          Pop.toast('You edited your task', 'succes')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }

    }
  }

}
</script>

<style lang="scss" scoped>

</style>
