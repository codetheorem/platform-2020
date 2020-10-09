<template>
    <div>
        <div :class="baseClass + easterEggID" @click="viewEasterEgg()" v-b-modal.easterEggModal>
            <img v-if="displayStamp" src="../assets/stamp.png" class="stamp-img">
        </div>
        <b-modal id="easterEggModal" :title="modalTitle" size="xl">
            <div class="ee-modal-container">
                <p class="my-4" style="padding-left: 4rem; padding-right: 4rem;">You've found a new Technica postcard! Postcards are scattered throughout the platform, so make sure to visit all the pages to find them all. If you find all 6 postcards, you'll win a special prize!</p>
                <div class="postcard-list-container">
                    <div class="postcard-wrapper" v-for="(postcard, index) in easterEggData" :key="postcard.id">
                        <a :href="easterEggLinks[index]">
                            <img v-if="postcard.discovered" :src="getPostcardImg(postcard, index)" class="postcard-img"/>
                            <div v-else class="postcard-placeholder"></div>
                        </a>
                    </div>
                </div>
            </div>
            <template v-slot:modal-footer>
                <Button text="Back to Page" @click="goBack"/>
            </template>
        </b-modal>
    </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

const TOTAL_EASTER_EGGS = 6;

export default {
  name: 'EasterEggStamp',
  mixins: [generalMixin],
  components: {
    Button,
  },
  props: {
    easterEggID: Number,
  },
  data() {
    return {
      postcards: [],
      easterEggData: [],
      displayStamp: false,

      totalEasterEggsFound: 0,
      totalEasterEggs: TOTAL_EASTER_EGGS,

      easterEggLinks: {
        0: "https://technica-brand-assets.s3.amazonaws.com/sofyako.png",
        1: "https://technica-brand-assets.s3.amazonaws.com/wandamerced.png",
        2: "https://technica-brand-assets.s3.amazonaws.com/ada lovelace.png",
        3: "https://technica-brand-assets.s3.amazonaws.com/carolyn bertozzi.png",
        4: "https://technica-brand-assets.s3.amazonaws.com/farida bedwei.png",
        5: "https://technica-brand-assets.s3.amazonaws.com/dijannafigueroa.png",
      },
      baseClass: "stamp-wrapper-",
      postcard_paths: ["sofyako.png","wandamerced.png","ada lovelace.png","carolyn bertozzi.png","farida bedwei.png","dijannafigueroa.png"],
    };
  },
  async created() {
    // await this.getTeam();
    await this.getEasterEggData();

    // this.dataLoaded = true;
  },
  computed: {
    modalTitle() {
      return `You’ve found ${this.totalEasterEggsFound} out of the ${this.totalEasterEggs} postcards!`;
    },
  },
  methods: {
    //retrieve egg data on page load
    async getEasterEggData() {
      const env = this.getCurrentEnvironment();
      const easterEggParams = {
        user_id: this.getUserId(),
      };
      const easterEggData = await this.performGetRequest(Config[env].ADMIN_BASE_ENDPOINT, env, 'get_easter_eggs', easterEggParams);
      
      if (easterEggData && easterEggData[0]) {
        const formattedEEData = [];
        Object.keys(easterEggData).forEach((d) => {
          formattedEEData.push(easterEggData[d]);
        });
        const easterEgg = formattedEEData.find((e) => e.easter_egg_id === this.easterEggID);

        if (easterEgg) {
          if (easterEgg.discovered === false) {
            this.displayStamp = true;
            this.currentEasterEggDBId = easterEgg.id;
          }

          this.easterEggData = formattedEEData;
          let totalEEFound = 0;
          this.easterEggData.forEach((d) => {
            if (d.discovered) {
              totalEEFound += 1;
            }
          });
          this.totalEasterEggsFound = totalEEFound;
        }
      }
    },
    getPostcardImg(postcard, index) {
      const imgContext = require.context('../assets/postcards', false, /\.png$/);
      console.log(this.postcard_paths[index], index);
      return imgContext(`./${this.postcard_paths[index]}`);
    },
    goBack() {
      this.$bvModal.hide('easterEggModal');
    },
    // when stamp is clicked
    viewEasterEgg() {
      this.easterEggData.find((e) => e.easter_egg_id === this.easterEggID).discovered = true;
      this.totalEasterEggsFound += 1;
      this.displayStamp = false;
      const env = this.getCurrentEnvironment();
      const params = {
        user_id: this.getUserId(),
        id: this.currentEasterEggDBId,
      };
      this.performPostRequest(Config[env].ADMIN_BASE_ENDPOINT, env, 'discover_easter_egg', params);
    },
    
  },
};
</script>

<style>


.stamp-img:hover {
    filter: drop-shadow(0px 0px 12px rgba(255, 80, 145, 0.7));
    cursor: pointer;
}

.ee-modal-container {
    width: 100%;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.postcard-list-container {
    height: 80%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.postcard-wrapper {
    flex: 0 0 25%;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-bottom: 2.5%;
    height: 50%;
}

.postcard-img {
    width: 100%;
    height: 100%;
}

.postcard-placeholder {
    height: 100%;
    width: 100%;
    background: #C4C4C4;
}

.modal-footer {
    justify-content: center !important;
}

/* custom positions for each stamp */

/* .stamp-wrapper {
    position: absolute;
    z-index: 1 !important;
    margin-left: -1rem;
    margin-top: -1rem;
} */

.stamp-wrapper-1 {
    position: relative;
    right: 30rem;
    top: 23rem;
    z-index: 1 !important;
    margin-left: -1rem;
    margin-top: -1rem;
}

.stamp-wrapper-2 {
    position: relative;
    right: 35rem;
    top: 100rem;
    z-index: 1 !important;
    margin-left: -1rem;
    margin-top: -1rem;
}
.stamp-wrapper-3 {
  position: absolute;
  z-index: 1 !important;
  margin-left: -1rem;
  margin-top: -1rem;
}
.stamp-wrapper-4 {
  position: relative;
  left: 30rem;
  top: 45rem;
  z-index: 1 !important;
  margin-left: -1rem;
  margin-top: -1rem;
}
.stamp-wrapper-5 {
  position: absolute;
  top: 45rem;
  z-index: 1 !important;
  margin-left: -1rem;
  margin-top: -1rem;
}
.stamp-wrapper-6 {
  position: absolute;
  top: 45rem;
  left: 71rem;
  z-index: 1 !important;
  margin-left: -1rem;
  margin-top: -1rem;
}

</style>
