
<template>
  <div>
    <h1>Sponsors</h1>
    <div v-for="section in sponsor_sections" :key="section.id" class="sponsor-section">
        <sponsor-section :tier="section.tier" :sponsor_list="sponsors_by_tier.get(section.tier)"/>
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
    let sponsor_sections = sponsor_tiers.map(x => {return {tier: x}});
    return {
      sponsor_tiers: sponsor_tiers,
      sponsors: [],
      sponsor_sections: sponsor_sections,
      sponsors_by_tier: new Map()
    }
  },
  async mounted(){
    console.log(process.env.NODE_ENV)
    this.sponsors = await this.getData(Config.dev.SPONSORS_INFO_ENDPOINT, "dev", "get_sponsorship_info");
    console.log(this.sponsors);

    for (const tier of this.sponsor_tiers) {
        this.sponsors_by_tier.set(tier, this.sponsors.filter(s => s['tier'] == tier)) 
    }
    console.log(this.sponsors_by_tier);
  },
};
</script>