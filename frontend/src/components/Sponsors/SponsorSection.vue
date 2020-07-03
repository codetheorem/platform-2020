<template>
  <div>
    <h2>{{tier}}</h2>

    <b-container class="bv-example-row">
        <b-row v-for="sponsor in sponsor_list" :key="sponsor.id" class="sponsor-section">
            <b-col>
                <SponsorCard :sponsor_name="sponsor.name" :sponsor_logo_url="sponsor.logo_image_url"/>
            </b-col>
        </b-row>
  </b-container>

    
    
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

<style>

.sponsor-section {
  padding: 30px;
  /* align-items: flex-start;
  display: flex;
  flex-direction: row; */
}

</style>