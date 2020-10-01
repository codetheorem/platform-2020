<template>
  <div class="page-container">
    <h2 class="page-header">{{ title }}</h2>
    <div class="body-container">
      <div class="row">
      <div class="col-md">
            <div v-for="item in leftPanelItems" :key="item.title">
                <div class="accordion">
                    <h6>{{ item.title }}</h6>
                <div class="faq-toggle-icon"></div>
                </div>
                <div class="panel">
                    <p v-html="item.description"></p>
                </div>
            </div>
        </div>
        <div class="col-md">
                      <div v-for="item in rightPanelItems" :key="item.title">
                <div class="accordion">
                    <h6>{{ item.title }}</h6>
                <div class="faq-toggle-icon"></div>
                </div>
                <div class="panel">
                    <p v-html="item.description"></p>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ContentPage',
  mounted() {
    const accordionElement = document.getElementsByClassName('accordion');
    for (let i = 0; i < accordionElement.length; i += 1) {
      accordionElement[i].addEventListener('click', function () {
        this.classList.toggle('accordion-active');
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  },
  props: {
    rightPanelItems: Array,
    leftPanelItems: Array,
    title: String,
  },
};
</script>

<style scoped>
.page-container {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.body-container {
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    box-sizing: border-box;
    border-radius: 20px;
    height: fit-content;
    min-width: 70vw;
    width: 70%;
    padding-left: 3rem;
    padding-right: 3rem;
}

.row {
    margin-top: 1rem !important;
}

.faq-toggle-icon {
  position: relative;
  width: 10px;
  height: 10px;
}

.faq-toggle-icon:before, .faq-toggle-icon:after {
    content: "";
    position: absolute;
    transition: transform 0.25s ease-out;
}

.faq-toggle-icon:before {
    content: "+";
}

.accordion-active > .faq-toggle-icon:before {
    content: "|" !important;
}

.accordion {
  display: flex;
  justify-content: space-between;
  border: none;
  padding-bottom: 2%;
  padding-top: 2%;
  margin-bottom: 2%;
  border-bottom: 3px solid white;
  transition: ease all 0.3s;
  cursor: pointer;
}

.accordion h6 {
    max-width: 95%;
    text-align: left;
}

.accordion:hover, .accordion-active {
  border-color: #CA484F;
}

.accordion-active .faq-toggle-icon:before {
  transform: rotate(90deg);
}

.accordion-active .faq-toggle-icon:after {
  transform: rotate(180deg);
}

.panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.1s ease-out;
}
@media (max-width: 575px) {
    .panel {
        font-size: 1rem;
    }
}

.col-md {
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
}
</style>
