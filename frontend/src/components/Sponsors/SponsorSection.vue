<template>
  <div>
        <h2>{{tier}}</h2>
        <b-row class="sponsor-section">
            <div v-for="sponsor in sponsor_list" :key="sponsor.id" >
                <b-col>
                    <SponsorCard :sponsor_name="sponsor.name" :sponsor_logo_url="sponsor.logo_image_url"/>
                </b-col>
            </div>
            
        </b-row>
  
    <!-- <b-container class="bv-example-row">
  <b-row>
    <b-col>1 of 3</b-col>
    <b-col>2 of 3</b-col>
    <b-col>3 of 3</b-col>
  </b-row>
</b-container> -->
    
    
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
  },
  methods: {
      has_data: function(){
          console.log((this.sponsor_list.length > 0));
          return (this.sponsor_list.length > 0);
      }
  }
};
</script>

<style>

.sponsor-section {
    justify-content: center;
  align-items: center;
  /* display: flex;
  flex-direction: row; */
}

</style>