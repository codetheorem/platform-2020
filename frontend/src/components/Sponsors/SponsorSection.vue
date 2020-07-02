<template>
  <div>
    <h2>{{tier}}</h2>
    <div v-for="sponsor in sponsor_list" :key="sponsor.id" class="sponsor-section">
        <SponsorCard :sponsor_name="sponsor.name" :sponsor_logo_url="sponsor.logo_image_url"/>
    </div>
    
  </div>
</template>

<script>
import SponsorCard from '@/components/Sponsors/SponsorCard.vue';

export default {
  name: 'SponsorSection',
  components: {
    SponsorCard,
  },
  props: {
      tier: String,
      sponsor_list: Array
  },
  async mounted(){
      console.log(this.tier, this.sponsor_list);
  }
};
</script>