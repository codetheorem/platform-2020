<template>
  <div>
      <b-row class="section-banner">
        <b-col class="hl">
        </b-col> 
        <b-col>
            <h2>{{tier.toUpperCase()}}</h2>
        </b-col>
        <b-col class="hl">
        </b-col>

          </b-row>
    
    <b-row class="row">
        <b-col v-for="sponsor in sponsor_list" :key="sponsor.id" class="col">
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

.section-banner {
    max-height: 50px;
    align-items: center;
}
.row {
  justify-content: center;
  align-items: center;
  height: 200px;
}

.col {
    height: 100%;
}

.hl {
  border-top: 6px solid #B377DB;
  width: 100%;
  height: 10px;
}
</style>