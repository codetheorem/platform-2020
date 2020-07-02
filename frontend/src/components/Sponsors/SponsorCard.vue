<template>
  <div>
    {{sponsor_name}}
    {{sponsor_logo_url}}
  </div>
</template>

<script>

export default {
  name: 'SponsorCard',

  props: {
      sponsor_name: String,
      sponsor_logo_url: String
  }
};
</script>