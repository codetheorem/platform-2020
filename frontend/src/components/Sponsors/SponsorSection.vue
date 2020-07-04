<template>
  <div>
    <h2>{{tier}}</h2>
    <b-row class="sponsor-section">
        <b-col v-for="sponsor in sponsor_list" :key="sponsor.id">
            <!-- <SponsorCard v-bind:sponsor_name="sponsor.name" v-bind:sponsor_logo_url="sponsor.logo_image_url"/> -->
            <SponsorCard v-bind:sponsor="sponsor"/>
        </b-col>        
    </b-row>
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