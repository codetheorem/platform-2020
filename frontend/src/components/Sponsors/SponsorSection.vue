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
    <b-row v-for="row in sponsor_grid" :key="row.id" class="row">
        <b-col v-for="sponsor in row" :key="sponsor.id" class="col-sm">
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
      sponsor_list: Array,
  },
  data(){
      return {
          sponsor_grid: [],
          num_rows: 0
      }
  },
  async mounted(){
      console.log(this.tier, this.sponsor_list);
        this.create_grid();
  },
  watch: { // watch prop on change, strangely this is needed for init
      sponsor_list: function(newVal, oldVal) {
        this.create_grid();
      }
  },
  methods: {
      create_grid: function() {
          for (let i = 0; i < this.sponsor_list.length; i+=1) {
            if (i % 3 == 0) {
                this.sponsor_grid.push([]);
                this.num_rows += 1;
            }
            this.sponsor_grid[this.num_rows-1].push(this.sponsor_list[i]);
        }
        console.log("grid", this.sponsor_grid);
        console.log("num_rows", this.num_rows);
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
  /* height: 200px; */
  margin: 1em
}

.col-sm {
    min-width: 15rem;
    height: 100%;
}

.hl {
  border-top: 6px solid #B377DB;
  width: 100%;
  height: 10px;
}
</style>