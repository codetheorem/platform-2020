<template>
  <div class="page-container">
    <b-container id="mentor-container" class="mentor-container">
      <h2 style="margin-bottom: 1.5rem;">Request a Mentor</h2>
    </b-container>
    <div class="mentor-body" style="display: flex;">
        <div class="mentor-left">
            <div class="mentor-form">
                <div>
                    <form @submit.prevent="goToProfile">
                        <div class="form-group">
                            <div class="input-wrapper">
                                <input type="text" class="form-control mx-auto title-large" id="titleInput" placeholder="Title" v-model="requestTitle">
                            </div>
                            <div class="input-wrapper">
                                <input type="text" class="form-control mx-auto" id="topicInput" placeholder="Topic (Java, iOS, Arduino, etc.)" v-model="requestTopic">
                            </div>
                            <div class="input-wrapper">
                                <textarea id="exampleFormControlTextarea1" rows="7" class="form-control mx-auto" v-model="requestDescription" placeholder="Describe your issue here (optional)."></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="mentor-form-buttons">
                    <Button size="lg" text="Clear" :outlineStyle="true" style="margin-right: 1rem;" @click="clearFields"/>
                    <Button size="lg" text="Submit Request" @click="submitMentorRequest"/>
                </div>
            </div>
            <div class="mentor-description">
                <p>This is a small guide to how to request a mentor in the system. It's a great and concise explanation, that hackers will certainly appreciate! </p>
            </div>
        </div>
        <div class="mentor-right">
            <div class="mentor-request-list">
                <div class="mentor-request-list-header">
                    UNRESOLVED
                </div>
                <div v-if="!requestsLoading && requests.length > 0" class="mentor-request-list-body">
                    <Banner v-for="request in requests" :text="request.title" :key="request.title + request.description"/>
                </div>
                <div v-if="!requestsLoading && requests.length <= 0" class="mentor-request-list-body">
                    <Banner text="Once you submit a mentorship request, it will be displayed here!" />
                </div>
                <div v-if="requestsLoading" class="mentor-request-list-body">
                    <div class="spinner-border" role="status" style="margin-top: 3rem;">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import Banner from '@/components/Banner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'RequestMentor',
  components: {
    Button,
    Banner,
  },
  mixins: [generalMixin],
  data() {
    return {
      requestTitle: '',
      requestTopic: '',
      requestDescription: '',
      requestsLoading: false,
      requests: [],
    };
  },
  async mounted() {
    await this.getMentorRequests();
  },
  methods: {
    async submitMentorRequest() {
      const env = this.getCurrentEnvironment();
      const requestMentorPostParams = {
        user_id: this.getUserId(),
        title: this.requestTitle,
        topic: this.requestTopic,
        description: this.requestDescription,
      };
      this.clearFields();
      console.log(requestMentorPostParams);
      await this.performPostRequest(Config[env].PROJECTS_BASE_ENDPOINT, env, 'create_mentorship_request', requestMentorPostParams);
      await this.getMentorRequests();
    },
    async getMentorRequests() {
      this.requestsLoading = true;
      const params = {
        user_id: this.getUserId(),
      };
      const env = this.getCurrentEnvironment();
      const invites = await this.performGetRequest(Config[env].PROJECTS_BASE_ENDPOINT, env, 'get_user_mentorship_requests', params);
      console.log(invites);
      this.requests = [];
      Object.keys(invites).forEach((k) => {
        this.requests.push(invites[k]);
      });
      this.requestsLoading = false;
    },
    clearFields() {
      this.requestTitle = '';
      this.requestTopic = '';
      this.requestDescription = '';
    },
  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
}
.page-container {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
}
.mentor-container {
  padding-top: 1rem;
}
.mentor-body {
  display: flex;
  padding-left: 10rem;
  padding-right: 10rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.mentor-left {
    height: 70vh;
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
}
.mentor-right {
    height: 70vh;
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
}
.mentor-form {
    height: 60%;
    width: 100%;
}
.mentor-description {
    height: 30%;
    width: 80%;
    margin-top: 10%;
    background: #DED2E5;
    border-radius: 8px;
    padding: 1rem;
}
.input-wrapper{
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.title-large {
    font-family: Noto Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 33px;
    color: #000000 !important;
}
.form-control {
    border: 1px solid #A88AA8 !important;
    width: 80%;
}
.mentor-form-buttons {
    float: right;
    margin-right: 10%;
}
.mentor-request-list {
    height: 100%;
    width: 80%;
    background: #FFFFFF;
    border: 4px solid #B377DB;
    box-sizing: border-box;
    border-radius: 0px 0px 4px 4px;
}
.mentor-request-list-header {
    height: 10%;
    width: 100%;
    font-family: DINPro;
    font-style: normal;
    font-weight: 500;
    font-size: 2rem !important;
    padding: .5rem;
    line-height: 31px;
    color: #B377DB;
}
.mentor-request-list-body {
    height: 90%;
    width: 100%;
    border-top: 4px solid #B377DB;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: column;
    overflow-y: scroll;
}
</style>
