<template>
  <b-container class="sponsors-container">
    <h1>Sponsors</h1>
    <div v-for="section in sponsorTiers" :key="section" class="sponsor-section">
        <sponsor-section :tier="section" :sponsorList="sponsorsByTier[section]"/>
    </div>
  </b-container>
</template>

<script>
import SponsorSection from '@/components/Sponsors/SponsorSection.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Sponsors',
  components: {
    SponsorSection,
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
    };
  },
  async mounted() {
    this.sponsors = await this.getDataSimple(Config.dev.SPONSORS_INFO_ENDPOINT, 'dev', 'get_sponsorship_info');

    this.sponsorTiers.forEach((tier) => {
      this.sponsorsByTier[tier] = this.sponsors.filter((s) => s.tier === tier);
    });
  },

};
</script>

<style>

body {background-color: #F6F4F7;}

.sponsors-container {
    padding: 30px;
}
.sponsor-section {
    padding: 10px;

}

h1 {
    color: #B377DB;
}

</style>
