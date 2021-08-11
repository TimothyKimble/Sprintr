<template>
  <div class="ProjectBacklogPage row w-100 m-0 d-flex justify-content-center bg-black">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-3">
          Backlog
        </div>
        <div class="col-md-3">
          <router-link :to="{name: 'ProjectBacklog', params: {id: router.params.id}}">
            Backlog
          </router-link>
        </div>
        <!-- <div v-for="s in AppState.sprints" :key="s" class="col-md-3">
          <router-link :to="{name: key.name, params: {id: router.params.id, sprintId: key.id}}">
            {{ key.name }}
          </router-link>
        </div> -->
      </div>
      <router-view />
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
    logger.log('router id:', router.params.id)
    logger.log('router keys:', Object.keys(router.params))
    const state = reactive({
      backlogItems: computed(() => AppState.backlogItems),
      createBacklogItem: {}
    })
    onMounted(async() => {
      const router = useRoute()
      try {
        const res = await projectsService.getAllSprintsIn(router.params.id)
        logger.log('This is the sprint responce,', res)
        logger.log('Apstate Sprints:', AppState.sprints)
      } catch (error) {
        Pop.toast('Error Get Sprint in Poject Item', 'error')
      }
    })
    return {
      state,
      router,
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

    .exampleBack {
    background-color: red($color: #df1d1d);
    }

    .fa-weight-hanging {
    color: #6c1890
    }
    .weight-text {
    color: #6c1890
    }
  </style>
