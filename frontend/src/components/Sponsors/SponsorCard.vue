<template>

    <div class="card">
        <img v-bind:src="sponsor_logo_url" v-bind:alt="sponsor_name" v-bind:id="card_id" class="img">

        <b-tooltip v-bind:target="card_id" triggers="hover">
            I am tooltip <b>component</b> content!
        </b-tooltip>
    </div>
    

</template>

<script>
export default {
  name: "SponsorCard",

  props: {
    sponsor_name: String,
    sponsor_logo_url: String
  },

  data(){
      sponsor_name: {{sponsor_name}}
      sponsor_logo_url: {{sponsor_logo_url}}
        card_id: {{sponsor_name}}
  },

    // beforeUpdate(){
    //     this.sponsor_name = {{sponsor_name}};
    //     this.sponsor_logo_url = {{sponsor_logo_url}};
    // },
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