<template>
    <div class="card">
        <img v-bind:src="sponsor.logo_image_url" v-bind:alt="sponsor.name" v-bind:id="sponsor.name" class="img">
        <b-tooltip v-bind:target="sponsor.name" triggers="hover">
            <h4>Company Information: </h4>
            Description
            <h4>Events Hosted: </h4>
            {{sponsor.events_hosted}}
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
        </b-tooltip>
    </div>
</template>

<script>
export default {
  name: "SponsorCard",

  props: {
    // sponsor_name: String,
    // sponsor_logo_url: String
    sponsor: Object
  },
    async mounted(){
      console.log(this.sponsor.events_hosted);
  },

};
</script>

<style>

.img {
    width: 100%;
    height: 100%; 
    object-fit: contain;
    display: block;
    
}
.card-div {

}
.card {
  max-width: 15rem;
  max-height: 15rem;
  padding: 30px;
  display: inline-block;

}

</style>