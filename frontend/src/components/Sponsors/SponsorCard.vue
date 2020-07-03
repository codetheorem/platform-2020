<template>

    <div class="card-div">
        <b-card
            v-bind:title="sponsor_name"
            v-bind:img-src="sponsor_logo_url"
            v-bind:img-alt="sponsor_name"
            img-top
            tag="article"
            v-bind:id="card_id"
            class="card"
        ></b-card>

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

.card-div {

}
.card {
  max-width: 15rem;
  height: 20rem;
  padding: 30px;
  display: inline-block;

}

</style>