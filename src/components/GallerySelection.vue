<template>
  <v-card dark :elevation="0" class="rounded-0">
    <v-card
      v-for="(image, index) in images"
      :key="index"
      height="100px"
      width="100px"
      :style="animatedItems.includes(index) ? 'transform: scale(1)' : ''"
      class="d-inline-block rounded-lg overflow-hidden ma-3 image-card"
      elevation="0"
      @click="imageSelected(index)"
    >
      <v-img @load="loaded(index)" aspect-ratio="1" :src="image" />
      <v-fade-transition>
        <v-overlay
          opacity=".6"
          v-show="selectedImage !== index"
          absolute
          color="black"
        >
        </v-overlay>
      </v-fade-transition>
    </v-card>

    <v-card
      height="100px"
      width="100px"
      :style="showAddButton ? 'transform: scale(1)' : ''"
      class="d-inline-block rounded-lg overflow-hidden ma-3  "
      elevation="0"
    >
      <add-image-button @addImage="$emit('addImage')" />
    </v-card>
  </v-card>
</template>

<script>
import AddImageButton from "./AddImageButton";
export default {
  name: "gallery-selection",
  components: { AddImageButton },
  props: ["images", "selected"],
  data() {
    return {
      loadedImages: [],
      showAddButton: false,
      init: false,
      animatedItems: [],
      selectedImage: 0
    };
  },
  created() {
    this.$emit("loading", true);
  },
  mounted() {
    this.selectedImage = this.selected;
  },
  computed: {
    allImagesLoaded() {
      return this.images.length === this.loadedImages.length && this.init;
    }
  },
  watch: {
    selected() {
      this.selectedImage = this.selected;
    },

    allImagesLoaded(val) {
      if (val) this.startAnimation();
    }
  },

  methods: {
    startAnimation() {
      this.$emit("loading", false);
      setTimeout(() => {
        this.loadedImages.forEach(el => {
          setTimeout(() => this.animatedItems.push(el), 100 * el);
          if (this.loadedImages.length - 1 === el)
            setTimeout(() => {
              this.showAddButton = true;
            }, 100 * el + 1);
        });
      }, 100);
    },
    imageSelected(index) {
      this.selectedImage = index;
      this.$emit("selected", index);
    },
    loaded(index) {
      this.loadedImages.push(index);
      this.init = true;
    }
  }
};
</script>
<style scoped>
.image-card {
  transition: 0.5s all;
  transform: scale(0);
}
.image-card:hover {
  transform: scale(1.2) !important;
}
</style>
