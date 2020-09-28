<template>
    <div class="card">
        <img v-bind:src="sponsor.logo_image_url" v-bind:alt="sponsor.name" v-bind:id="sponsor.name" class="img">
        <!-- <b-tooltip v-bind:target="sponsor.name" triggers="hover" id="tooltip-custom">
              <b-row class="tooltip-text">
                <b-col>
                    <h4>Sponsor Information: </h4>
                    {{sponsor.info}}
                </b-col>
                <b-col v-if="sponsor.events_hosted || sponsor.prizes">
                    <h4 v-if="sponsor.events_hosted">Events Hosted: </h4>
                    <ul>
                        <li v-for="event in sponsor.events_hosted" :key="event">
                            {{ event }}
                        </li>
                    </ul>
                    <h4 v-if="sponsor.prizes">Sponsor Prizes: </h4>
                    <ul>
                        <li v-for="prize in sponsor.prizes" :key="prize">
                            {{ prize }}
                        </li>
                    </ul>
                </b-col>
            </b-row>
        </b-tooltip> -->
    </div>
</template>

<script>
export default {
  name: 'SponsorCard',
  props: {
    sponsor: Object,
  },
};
</script>

<style scoped>

.img {
    max-height: 6rem;
    max-width: 100%;
    object-fit: contain;
}

.card {
  width: 100%;
  height: 100%;
  max-width: 15rem;
  max-height: 10rem;
  padding: 30px;
  display: inline-block;
  border-radius: 1em;
}

ul {
  text-align: left;
}

.tooltip-text{
  color: black;
}

#tooltip-custom{
  opacity: 1.0 !important;
}

</style>
