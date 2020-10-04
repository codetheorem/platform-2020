<template>
  <div>
    <h2 class="page-header">Sponsors</h2>
    <b-container class="sponsors-container">
      <div v-if="dataLoaded">
        <p>Below is a list of our amazing event sponsors. Click a sponsor's logo below to visit their virtual booth, where you can view more information about their organization, schedule an appointment with them, and more!</p>
        <div v-for="section in sponsorTiers" :key="section" class="sponsor-section">
            <sponsor-section :tier="section" :sponsorList="sponsorsByTier[section]"/>
        </div>
      </div>
      <div v-else>
        <LoadingSpinner />
      </div>
    </b-container>
  </div>
</template>

<script>
import SponsorSection from '@/components/Sponsors/SponsorSection.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Sponsors',
  components: {
    SponsorSection,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  // create sponsor sections
  data() {
    const sponsorTiers = ['Partners', 'Platinum', 'Gold'];
    const sponsorsByTier = {};
    sponsorTiers.forEach((tier) => {
      sponsorsByTier[tier] = [];
    });

    return {
      sponsorTiers,
      sponsors: [],
      sponsorsByTier,
      dataLoaded: false,
    };
  },
  async mounted() {
    const env = this.getCurrentEnvironment();
    this.sponsors = await this.getDataSimple(Config[env].SPONSORS_INFO_ENDPOINT, env, 'get_sponsorship_info');

    this.sponsorTiers.forEach((tier) => {
      this.sponsorsByTier[tier] = this.sponsors.filter((s) => s.tier === tier);
    });
    this.dataLoaded = true;
  },

};
</script>

<style scoped>

.sponsors-container {
    padding: 30px;
}
.sponsor-section {
    padding: 10px;

}

</style>
