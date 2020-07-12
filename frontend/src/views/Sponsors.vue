
<template>
  <b-container class="sponsors-container">
    <h1>Sponsors</h1>
    <div v-for="section in sponsorTiers" :key="section" class="sponsor-section">
        <sponsor-section :tier="section" :sponsorList="sponsorsByTier[section]"/>
    </div>
  </b-container>
</template>


<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';
import Button from '@/components/Button.vue';
import SponsorSection from '@/components/Sponsors/SponsorSection.vue';


export default {
    name: 'Sponsors',
    components: {
        Button, SponsorSection
    },
    mixins: [generalMixin],
    // create sponsor sections
    data(){
        let sponsorTiers = ["Partners","Platinum","Gold"];
        let sponsorsByTier = {}
        for (const tier of sponsorTiers) {
            sponsorsByTier[tier] = [];
        }
        return {
            sponsorTiers: sponsorTiers,
            sponsors: [],
            sponsorsByTier: sponsorsByTier
        }
    },
    async mounted(){
        this.sponsors = await this.getDataSimple(Config.dev.SPONSORS_INFO_ENDPOINT, "dev", "get_sponsorship_info");

        for (const tier of this.sponsorTiers) {
            this.sponsorsByTier[tier] = this.sponsors.filter(s => s['tier'] == tier);
        }
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