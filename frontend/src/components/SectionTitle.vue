<template>
  <div>
      <b-row class="section-banner">
            <b-col class="hl"></b-col>
            <b-col class="section-title">
                <h3 class="medium">{{ title.toUpperCase() }}</h3>
            </b-col>
            <b-col class="hl"></b-col>
        </b-row>
  </div>
</template>

<script>

export default {
  name: 'SectionTitle',
  props: {
    title: String,
  },
};
</script>

<style>

.section-banner {
    max-height: 50px;
    align-items: center;
}

.section-title {
  min-width: 15em;
  max-width: 15em;
}

/* horizontal line */
.hl {
  border-top: 6px solid #B377DB;
  width: 100%;
  height: 10px;
}
</style>
