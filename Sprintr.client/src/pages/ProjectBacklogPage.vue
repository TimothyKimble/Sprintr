<template>
  <div class="ProjectBacklogPage row w-100 m-0 d-flex justify-content-center">
    <!-- Load BackLoadItems -->
    <div class="col-md-12 p-0 m-5 border border-dark shadow drop-shadow">
      <div class="row w-100 m-0 p-5">
        <div class="col-md-8 p-3">
          <h4>Backlog Items</h4>
          <h6>Group your tasks into items for over-arching collections for better organization </h6>
        </div>
        <div class="col-md-4 p-0 d-flex justify-content-center align-items-center">
          <button class="btn btn-success roundedButton" data-toggle="modal" data-target="#backlogItemModal">
            <p class="m-0 p-0">
              +
            </p>
          </button>
        </div>
        <div class="col-md-12 border-top border-dark">
          <!-- eslint-disable-next-line vue/attribute-hyphenation -->
          <!-- <BacklogItemThread :backlogItem="state.backlogItems" /> -->
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade"
       id="backlogItemModal"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Create New Backlog Item
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createBacklogItem">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text"
                     v-model="state.createBacklogItem.name"
                     placeholder="Name..."
                     id="name"
                     name="name"
                     class="form-control"
              >
              <label for="body">Description</label>
              <textarea v-model="state.createBacklogItem.body"
                        placeholder="Description..."
                        class="form-control"
                        name="body"
                        id="body"
                        rows="3"
                        minlength="3"
                        required
              ></textarea>
              <label for="color" class="">Color: </label>
              <input class="mb-2 ml-2" type="color" name="color" id="color" v-model="state.createBacklogItem.color">

              <div class="form-check">
                <label class="form-check-label">
                  <input v-model="state.createBacklogItem.isOpen"
                         type="checkbox"
                         class="form-check-input"
                         name="isOpen"
                         id="isOpen"
                         value="checkedValue"
                  >
                  Check if Not Done
                </label>
              </div>
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
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { projectsService } from '../services/ProjectsService'
import { backlogItemsService } from '../services/BacklogItemsService'
import { logger } from '../utils/Logger'
import Pop from '../utils/Notifier'
import { AppState } from '../AppState'

export default {
  name: 'ProjectBacklogPage',
  router: useRoute(),
  setup() {
    // $('#show').click(function() {
    //   $('#backlogItemsModal').modal('show')
    // })
    const router = useRoute()
    const state = reactive({
      backlogItems: computed(() => AppState.backlogItems),
      createBacklogItem: {}
    })
    onMounted(async() => {
      const router = useRoute()
      try {
        await projectsService.getAllBacklogItemsIn(router.params.id)
      } catch (error) {
        Pop.toast('Error Get Backlog Item', 'error')
      }
    })
    return {
      state,
      async createBacklogItem() {
        try {
          state.createBacklogItem.creatorId = AppState.account.id
          state.createBacklogItem.projectId = router.params.id
          const res = await backlogItemsService.createBacklogItem(state.createBacklogItem)
          logger.log(res)
          $('#backlogItemModal').modal('hide')
          state.createBacklogItem = {}
          Pop.toast('You Made A Task!', 'success')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.projectBacklogPage{
  text-align: center;
  user-select: none;
  > img{
    height: 200px;
    width: 200px;
  }
}

.roundedButton {
  border-radius: 50%;
}
</style>
