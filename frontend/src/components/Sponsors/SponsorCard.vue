<template>
    <div class="card">
        <img v-bind:src="sponsor.logo_image_url" v-bind:alt="sponsor.name" v-bind:id="sponsor.name" class="img">
        <b-tooltip v-bind:target="sponsor.name" triggers="hover">
              <b-row class="tooltip-text">
                <b-col>
                    <h4>Sponsor Information: </h4>
                    {{sponsor.info}}
                </b-col>
                <b-col>
                    <h4>Events Hosted: </h4>
                    <ul>
                        <li v-for="event in sponsor.events_hosted" :key="event">
                            {{ event }}
                        </li>
                    </ul>
                    <h4>Sponsor Prizes: </h4>
                    <ul>
                        <li v-for="prize in sponsor.prizes" :key="prize">
                            {{ prize }}
                        </li>
                    </ul>
                </b-col>
            </b-row>
            
            
        </b-tooltip>
    </div>
</template>

<script>
export default {
  name: "SponsorCard",

  props: {
    sponsor: Object
  },
    async mounted(){
      console.log(this.sponsor.events_hosted);
  },

};
</script>

<style>

.img {
    max-height: 10rem;
    max-width: 100%;
    object-fit: contain;
    /* display: block; */
    
}

.card {
  
  max-width: 20rem;
  max-height: 15rem;
  /* height: 100%; */
  padding: 30px;
  display: inline-block;
  border-radius: 1em;

}

.tooltip .tooltip-inner{
  max-width: 800px !important;
  padding: 10px;
  background-color: #DED2E5;
  opacity: 1.0!important;  
}

.tooltip-text{
    color: black;
}

ul {
    text-align: left;
}
</style>