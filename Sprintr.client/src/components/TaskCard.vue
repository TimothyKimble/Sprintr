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
              <label :for="'name'+task.id" class="">Name </label>
              <input class="mb-2 ml-2"
                     type="string"
                     :name="'name'+task.id"
                     :id="'name'+task.id"
                     placeholder="0"
                     v-model="editCard.name"
              >
              <label :for="'weight'+task.id" class="">Weight </label>
              <input class="mb-2 ml-2"
                     type="number"
                     :name="'weight'+task.id"
                     :id="'weight'+task.id"
                     placeholder="0"
                     v-model="editCard.weight"
              >
              <label :for="'sprintId'+task.id">Task for Sprint:   </label>
              <select v-model="editCard.sprintId" :name="'sprintId'+task.id" :id="'sprintId'+task.id">
                <option value="unassigned">
                  unassigned
                </option>
                <option v-for="s in sprintsIn" :key="s" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
              <select v-model="editCard.status" :name="'tastStatue'+task.id" :id="'tastStatue'+task.id">
                <option v-if="editCard.status !== 'pending'" value="pending">
                  pending
                </option>
                <option v-if="editCard.status !== 'in-progress'" value="in-progress">
                  in-progress
                </option>
                <option v-if="editCard.status !== 'review'" value="review">
                  review
                </option>
                <option v-if="editCard.status !== 'done'" value="done">
                  done
                </option>
              </select>
              <label :for="'tastStatue'+task.id">currentStatus: {{ editCard.status }}</label>
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
                     v-model="state.createNote.body"
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
import { computed, onMounted } from '@vue/runtime-core'
import { sprintsService } from '../services/SprintsService'

export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    onMounted(async() => {
      try {
        AppState.taskCopy = { ...props.task }
        // logger.log('What is my prop,', props.task)
        // logger.log('What is my Appstate Copy,', AppState.taskCopy)
        // logger.log('What is my Edit Copy,', editCard)
      } catch (error) {
        logger.log('JEsus this died', error)
      }
    })
    const editCard = computed(() => AppState.taskCopy)
    const state = reactive({
      actualCard: props.task,
      createNote: {}
    }

    // logger.log('task Prop :', props.task)
    )
    return {
      editCard,
      state,
      async editTask() {
        try {
          logger.log('What is my Edit Copy SUBMMITTT,', editCard.value.target)
          logger.log('What is my Edit Copy IN APP SUBMIT,', AppState.taskCopy)

          logger.log(editCard.creatorId, AppState.account.id)
          editCard.creatorId = AppState.account.id
          await tasksService.editTask(AppState.taskCopy)
          if (AppState.taskCopy.sprintId !== state.actualCard.sprintId) {
            await sprintsService.getAllTasksIn(state.actualCard.sprintId)
            logger.log('Task sprint was moved')
            if (AppState.taskCopy.sprintId === 'unassigned') {
              delete AppState.taskCopy.sprintId
              logger.log('Task sprintI was unassigned')
            }
          }
          state.actualCard = editCard
          AppState.taskCopy = props.task
          $('#edit' + props.task.ik).modal('hide')
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
          // TODO right now this just returns all notes
          await tasksService.getNotesIn({ taskId: props.task.id })
          state.createNote = {}
          $('#addNote').modal('hide')
          Pop.toast('You edited your task', 'succes')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      sprintsIn: computed(() => AppState.sprints)

    }
  }

}
</script>

<style lang="scss" scoped>

</style>
