<template>
  <div class="page-container">
      <h2 class="page-header">Prizes</h2>
      <b-container style="margin-bottom: 5rem;">
          <div>
              <SectionTitle title="Technica" />
              <div class="prize-container">
                    <div v-for="prize in eventPrizes" :key="prize.title" class="prize-card">
                        <img src="../assets/technica-logo-icon.png" style="height: 50px; width: 55px;"/>
                        <div class="prize-title">
                            {{ prize.title }}
                        </div>
                    </div>
              </div>
          </div>
      </b-container>
  </div>
</template>

<script>
import SectionTitle from '../components/SectionTitle';
import Content from '../config/content';
import generalMixin from '../mixins/general';

export default {
  name: 'prizes',
  components: {
    SectionTitle,
  },
  mixins: [generalMixin],
  computed: {
    eventPrizes() {
      return Content.prizes.eventPrizes;
    },
  },
};
</script>

<style scoped>
.section-container {
    width: 80%;
    height: fit-content;
}

.prize-container {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
}

.prize-card {
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    color: #2c3e50;
    height: fit-content;
    min-height: 8rem;
    border: 1px solid grey;
    margin: 1rem;
}

.prize-title {
    margin-left: 1rem;
    font-size: 22px;
}
</style>
