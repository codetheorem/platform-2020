<template>
  <div>
    <b-container class="passport-container">
      <h2 class="page-header">My Virtual Passport</h2>
      <p>Your Virtual Passport helps you keep track of the different things you've done during the event. The dots on the left are a tally of the number of events you've attended.</p>
      <p>The stickers on the right remain grey until you complete them, and then they'll turn purple. Collect all the stickers in order to win a special prize!</p>
      <div class="display-container" v-if="activityLoaded">
        <div class="passport-wrapper">
            <div class="left-panel-inner">
                <div class="attendance-title">
                    <img v-bind:src="getImgUrl(photos[0])" class="member-list-photo"/>
                    <b class="passport-title-bold">{{ getUserName() }}</b>
                </div>
                <div class="events-title-wrapper">
                    <p>
                        <span class="header-text-purple">#</span>
                        <span class="attendance-text">Events Attended</span>
                    </p>
                </div>
                <div class="dot-wrapper">
                    <div v-for="dot in activityDots" :key="dot" class="dot-inner">
                        <div class="dot" :class="{'activity-completed': dot}"></div>
                    </div>
                </div>
            </div>
            <div style="width: 50%; height: 100%;">
                <div style="margin-top: 1rem;">
                    <b class="passport-title-bold">Stickers</b>
                </div>
                <div class="sticker-wrapper">
                    <div v-for="sticker in activityStickers" :key="sticker.text" class="dot-inner sticker-inner">
                        <div class="sticker" :class="{'activity-completed': sticker.active}">
                            <p style="color: #FFFFFF; font-family: NotoSans; font-weight: bold;font-size: 16px; margin-bottom: 0;">{{ sticker.text }}</p>
                        </div>
                    </div>
                </div>
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
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'Passport',
  components: {
    LoadingSpinner,
  },
  mixins: [generalMixin],
  data() {
    return {
      activityLoaded: false,
      photos_path: '../assets/profile_pics/',
      photos: ['Profile Sun', 'Profile Mountain', 'Profile Cloud 2', 'Profile Wave', 'Profile Cloud 1'],
      shortlinkActivity: [],
      activityDots: [true, false, false, false, false, false, false, false, false],
      activityStickers: [{ text: 'Attended 1 event', active: true }, { text: 'Attended 2 events', active: false }, { text: 'Demoed My Hack', active: false }, { text: 'Attended 2 Diversity Events', active: false }, { text: 'Viewed the Live Stream', active: false }, { text: 'Attended 9 events', active: false }],
    };
  },
  async mounted() {
    await this.getShortlinkActivity();
  },
  methods: {
    async getShortlinkActivity() {
      const teamParams = {
        user_id: this.getUserId(),
      };
      this.shortlinkActivity = await this.performGetRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'get_user_shortlink_clicks', teamParams);
      this.activityLoaded = true;
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

.passport-wrapper {
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: row;
    background: #F9F9F9;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 35px 35px 35px 35px;
}

.left-panel-inner {
    width: 50%;
    height: 100%;
    border-right: 1px solid #C4C4C4;
}

.passport-title-bold {
    margin-left: 1rem;
    font-size: 36px;
    line-height: 46px;
}

.member-list-item {
    width: 100%;
    border: 2px solid #CA484F;
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
    width: 100%;
    height: 30%;
    padding-top: 1rem;
}

.header-text-purple {
    font-family: DINPro;
    font-style: normal;
    font-weight: 600;
    font-size: 96px;
    color: #D66D50;
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

.events-title-wrapper {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #C4C4C4;
}

.dot-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 50%;
  border-top: 1px solid #C4C4C4;
}

.dot-inner {
    flex: 0 0 10%;
    height: 10%;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 7.5%;
    margin-top: 5%;
}

.dot {
    height: 2.5rem;
    width: 2.5rem;
    background-color: #999;
    border-radius: 50%;
}

.sticker-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 80%;
}

.sticker-inner {
    flex: 0 0 30%;
    height: 30%;
    margin-right: 5%;
    margin-left: 5%;
    margin-top: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sticker {
    height: 6rem;
    width: 6rem;
    background-color: #999;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.activity-completed {
    background: #D66D50;
}

@media (max-width: 1300px) {
  .member-list-photo {
    width: 5rem;
    height: 5rem;
  }

  .sticker-inner {
    margin-top: 2.5%;
  }
}
</style>
