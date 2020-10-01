<template>
  <div>
    <h2 class="page-header">Mentor Management</h2>
    <div class="container">
      <div class="row">
        <div class="col-md-4 filter-bar">
          <div class="filter-buttons">
            <Button size="sm" text="Active" @click="viewActive()" class="filter"/>
            <Button size="sm" text="Resolved" @click="viewResolved()" class="filter"/>
          </div>
        </div>
        <div class="col-md-8 request-list">
          <div v-if="dataLoaded" class="request-cards">
            <div v-for="request in allMentorRequests" :key="request.id" style="width: 100%;">
              <MentorManagementCard v-bind:requestDescription=request.formattedDescription @viewCard="viewCard"/>
            </div>
          </div>
          <div v-else style="margin-top:1rem;">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    </div>
    <b-modal id="request-view-modal" title="View Request">
      <p class="my-4">Here's more info about the request:</p>
      <p class="my-4">{{ activeRequestTitle }}</p>
    </b-modal>
  </div>
</template>

<script>
import MentorManagementCard from '@/components/Mentors/MentorManagementCard.vue';
import Button from '@/components/Button.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'Home',
  components: {
    MentorManagementCard,
    Button,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  data() {
    const allMentorRequests = {};

    return {
      allMentorRequests,
      dataLoaded: false,
      activeRequestTitle: '',
    };
  },
  async mounted() {
    this.allMentorRequests = await this.getDataSimple(this.getEnvVariable('PROJECTS_BASE_ENDPOINT'), 'get_active_mentorship_requests');

    this.allMentorRequests.forEach((request) => {
      // eslint-disable-next-line no-param-reassign
      request.formattedDescription = `Someone wants help with ${request.category}. '${request.description}'`;
    });

    this.dataLoaded = true;
  },
  methods: {
    viewCard(card) {
      this.activeRequestTitle = card.title;
    },
  },
};
</script>

<style scoped>

h2 {
  color: var(--bright-purple);
}

.container {
  padding: 2rem;
}

.request-list {
  background-color: #FFF;
  border: 4px solid var(--pastel-purple);
  overflow: auto;
  height: 70vh;
}

.request-cards {
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.filter-bar {
  background-color: var(--light-purple);
}

.filter-buttons {
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.filter {
  width:100%;
  background: #FFF;
  color: #000;

  border: none;
  border-radius: 8px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 15px;
  text-align: left;
}

.main {
  display: flex;
  padding: 2rem;
  padding-left: 5rem;
  padding-right: 5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

</style>
