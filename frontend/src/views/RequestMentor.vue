<template>
  <div>
    <b-container id="mentor-container">
      <h2 class="page-header">Request a Mentor</h2>
    </b-container>
    <div class="mentor-body" style="display: flex;">
        <div class="mentor-left">
            <div class="mentor-form">
                <div style="margin-top: -1rem;">
                    <form @submit.prevent="goToProfile">
                        <div class="form-group">
                            <div class="input-wrapper">
                                <input type="text" class="form-control mx-auto title-large" id="titleInput" placeholder="Title" v-model="requestTitle">
                            </div>

                            <div class="dropdown">
                              <a class="nav-link mx-auto dropdown-toggle dropdown-border" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{topicDropdown}}
                              </a>

                              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <a class="dropdown-item" href="#" v-for="option in options" :key="option.value" :value="option.value" @click="topicDropdown = option.value">{{option.value}}</a>
                              </div>
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
                <p>After you submit your request for a mentor, the request will be visible by all mentors at the event. Once a mentor claims your request, you'll be connected over slack automatically. Please be as detailed as possible in your request, including specific coding languages/technologies you're using.</p>
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
                    <LoadingSpinner />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import Banner from '@/components/Banner.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'RequestMentor',
  components: {
    Button,
    Banner,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  data() {
    return {
      requestTitle: '',
      requestDescription: '',
      requestsLoading: false,
      requests: [],
      topicDropdown: 'Topic',
      options: [
        {
          value: 'IOS',
        },
        {
          value: 'Android',
        },
        {
          value: 'Backend',
        },
        {
          value: 'Frontend',
        },
        {
          value: 'Hardware',
        },
        {
          value: 'Other',
        },
      ],
    };
  },
  async mounted() {
    await this.activityTracking('REQUEST_MENTOR');
    await this.getMentorRequests();
  },
  methods: {
    async submitMentorRequest() {
      const env = this.getCurrentEnvironment();
      const requestMentorPostParams = {
        user_id: this.getUserId(),
        title: this.requestTitle,
        topic: this.topicDropdown,
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
        if (!invites[k].resolved) {
          this.requests.push(invites[k]);
        }
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

.mentor-body {
  display: flex;
  padding-left: 10rem;
  padding-right: 10rem;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}
.mentor-left {
    height: fit-content;
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
    height: 100%;
    width: 100%;
}
.mentor-description {
    height: fit-content;
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
.dropdown-menu, .dropdown-item{
    color:#5a6167 !important;
    font-size: 18px;
    font-weight: 600;
}
.dropdown-toggle{
    padding-left: 13.5px !important;
    padding-right: 13.5px !important;
    padding-top: 6.75px !important;
    padding-bottom: 6.75px !important;
    background-color: white;
    display:flex;
    align-items: center;
    justify-content: space-between;
    color: #5a6167;
}
.dropdown{
    padding-left: 17.5px;
    padding-right: 17.5px;
}
.dropdown-menu{
    width: 80%;
}
.dropdown-item{
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    margin-left: 5px;
}
.dropdown-item:hover{
    color: #B377DB !important;
    background: rgba(182, 161, 196, 0.25);
    border-radius: 4px;
    width: 93%;
}
@media (max-width: 1950px) {
  .dropdown-item:hover{
    color: #B377DB !important;
    background: rgba(182, 161, 196, 0.25);
    border-radius: 4px;
    width: 90%;
  }
}
@media (max-width: 1800px) {
  .dropdown-item:hover{
    color: #B377DB !important;
    background: rgba(182, 161, 196, 0.25);
    border-radius: 4px;
    width: 85%;
  }
}
.dropdown-border {
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid #A88AA8 !important;
    width: 80%;
    border-radius: 4px;
}

@media (max-width: 1200px) {
  .mentor-body {
    padding: 2rem;
  }

  .mentor-left, .mentor-right {
    width: 50%;
  }
}
</style>
