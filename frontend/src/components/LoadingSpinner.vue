<template>
    <div class="loading-spinner-wrapper">
        <b-spinner label="Loading..."></b-spinner>
    </div>
</template>

<script>

export default {
  name: 'LoadingSpinner',
};
</script>

<style>
    .loading-spinner-wrapper {
        margin-top: 3rem;
    }
    .loading-spinner-img {
        height: 216px;
    }
    .spinner-border {
        border-color:#D66D50 !important;
        border-right-color: transparent !important;
    }
</style>
