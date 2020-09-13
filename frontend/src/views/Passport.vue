<template>
  <div>
    <b-container class="passport-container">
      <h2 class="page-header">My Passport</h2>
      <div class="display-container" v-if="activityLoaded">
        <!-- <div>
            <img v-bind:src="getImgUrl(photos[0])" class="member-list-photo"/>
            <div class="member-list-info">
                <div><b>{{ getUserName() }}</b></div>
            </div>
        </div> -->
        <div style="width: 100%; height: 60vh; border: 1px solid blue; display: flex; flex-direction: row;">
            <div style="border: 1px solid green; width: 50%; height: 100%;">
                <div  class="attendance-title" style="border: 1px solid green; width: 100%; height: 30%; padding-top: 2rem;">
                    <img v-bind:src="getImgUrl(photos[0])" class="member-list-photo"/>
                    <b style="margin-left: 1rem;font-size: 36px; line-height: 46px;">{{ getUserName() }}</b>
                </div>
                <div style="border: 1px solid green; width: 100%; height: 20%; display: flex; justify-content: center; align-items: center;">
                    <p><span class="header-text-purple">#</span> <span class="attendance-text">Events Attended</span></p>
                </div>
                <div class="dot-wrapper">
                    <div v-for="dot in activityDots" :key="dot" class="dot-inner">
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
            <div style="border: 1px solid red; width: 50%; height: 100%;">
            </div>
        </div>
      </div>
      <div v-else>
        <LoadingSpinner />
      </div>
      <div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Passport',
  components: {
    Button,
    LoadingSpinner
  },
  mixins: [generalMixin],
  data() {
    return {
      activityLoaded: false,
      photos_path: '../assets/profile_pics/',
      photos: ['Profile Sun', 'Profile Mountain', 'Profile Cloud 2', 'Profile Wave', 'Profile Cloud 1'],
      shortlinkActivity: [],
      activityDots: [true, true, true, true, false, false, false, false, false],
    };
  },
  async mounted() {
    await this.getShortlinkActivity();
  },
  methods: {
    async getShortlinkActivity() {
      const env = this.getCurrentEnvironment();
      const teamParams = {
        user_id: this.getUserId(),
      };
      this.shortlinkActivity = await this.performGetRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'get_user_shortlink_clicks', teamParams);
      this.activityLoaded = true;
      console.log(this.shortlinkActivity);
    },
    getImgUrl(imgName) {
      const images = require.context('../assets/profile_pics', false, /\.png$/);
      return images(`./${imgName}.png`);
    },
  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
}

.passport-container {
  padding: 30px;
}

.display-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
}

.member-list-item {
    width: 100%;
    border: 2px solid #A88AA8;
    box-sizing: border-box;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
}

.member-list-photo {
    background: #C4C4C4;
    border-radius: 2px;
    width: 7rem;
    height: 7rem;
    margin: 3px;
}

.member-list-info {
    margin-top: 1rem;
    margin-bottom: 2rem;
    margin-right: 1rem;
    margin-left: .75rem;
}

.attendance-title {
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-text-purple {
    font-family: DINPro;
    font-style: normal;
    font-weight: 600;
    font-size: 96px;
    color: #B377DB;
    margin-right: 1rem;
}

.attendance-text {
    font-family: DINPro;
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 46px;
    text-align: center;
    color: rgba(0, 0, 0, 0.35);
}

.dot-wrapper {
    display: flex;                     
  flex-wrap: wrap;                
  justify-content: space-around;
  width: 100%; 
  height: 50%;
}

.dot-inner {
    flex: 0 0 10%;
    height: 10%;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 7.5%;
}

.dot {
    height: 2.5rem;
    width: 2.5rem;
    background-color: #999;
    border-radius: 50%;
}
</style>
