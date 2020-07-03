
<template>
  <div>
    <h1>Sponsors</h1>
    <div v-for="section in sponsor_tiers" :key="section" class="sponsor-section">
        <sponsor-section :tier="section" :sponsor_list="sponsors_by_tier(section)"/>
    </div>
  </div>
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
        let sponsor_tiers = ["Platinum","Gold","Silver"];
        return {
            sponsor_tiers: sponsor_tiers,
            sponsors: [],
            // sponsors_by_tier: {}
        }
    },
    async mounted(){
        console.log(process.env.NODE_ENV)
        this.sponsors = await this.getData(Config.dev.SPONSORS_INFO_ENDPOINT, "dev", "get_sponsorship_info");
        console.log(this.sponsors);

        // for (const tier of this.sponsor_tiers) {
        //     this.sponsors_by_tier[tier] = this.sponsors.filter(s => s['tier'] == tier);
        // }
        // console.log(this.sponsors_by_tier);
    },

    // beforeUpdate(){
    //     for (const tier of this.sponsor_tiers) {
    //         this.sponsors_by_tier[tier] = this.sponsors.filter(s => s['tier'] == tier);
    //     }
    // },
    methods: {
        sponsors_by_tier: function(tier) {
            return this.sponsors.filter(s => s['tier'] == tier);
        }
    }
};
</script>