
<template>
  <b-container class="sponsors-container">
    <h1>Sponsors</h1>
    <div v-for="section in sponsor_tiers" :key="section" class="sponsor-section">
        <sponsor-section :tier="section" :sponsor_list="sponsors_by_tier[section]"/>
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
        let sponsor_tiers = ["Partners","Platinum","Gold"];
        let sponsors_by_tier = {}
        for (const tier of sponsor_tiers) {
            sponsors_by_tier[tier] = [];
        }
        return {
            sponsor_tiers: sponsor_tiers,
            sponsors: [],
            sponsors_by_tier: sponsors_by_tier
        }
    },
    async mounted(){
        console.log(process.env.NODE_ENV)
        this.sponsors = await this.getDataSimple(Config.dev.SPONSORS_INFO_ENDPOINT, "dev", "get_sponsorship_info");
        console.log(this.sponsors);

        for (const tier of this.sponsor_tiers) {
            this.sponsors_by_tier[tier] = this.sponsors.filter(s => s['tier'] == tier);
        }
        console.log("sponsors by tier", this.sponsors_by_tier);
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