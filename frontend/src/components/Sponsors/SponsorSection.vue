<template>
  <div>
      <b-row class="section-banner">
        <b-col class="hl"></b-col>
        <b-col class="section-title">
            <h2>{{tier.toUpperCase()}}</h2>
        </b-col>
        <b-col class="hl"></b-col>

          </b-row>
    <b-row v-for="row in sponsorGrid" :key="row.id" class="row">
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
    sponsorList: Array,
  },
  data() {
    return {
      sponsorGrid: [],
      numRows: 0,
    };
  },
  async mounted() {
    this.create_grid();
  },
  watch: { // watch prop on change, strangely this is needed for init
    sponsorList() {
      this.create_grid();
    },
  },
  methods: {
    create_grid() {
      for (let i = 0; i < this.sponsorList.length; i += 1) {
        if (i % 3 === 0) {
          this.sponsorGrid.push([]);
          this.numRows += 1;
        }
        this.sponsorGrid[this.numRows - 1].push(this.sponsorList[i]);
      }
    },
  },

};
</script>

<style>

.section-banner {
    max-height: 50px;
    align-items: center;
}

.section-title {
  min-width: 15rem;
  max-width: 15rem;
}

.row {
  justify-content: center;
  align-items: center;
  margin: 1em
}

.col-sm {
    min-width: 15rem;
    height: 100%;
    padding-top: 1em;
    padding-bottom: 1em;
}

.hl {
  border-top: 6px solid #B377DB;
  width: 100%;
  height: 10px;
}
</style>
