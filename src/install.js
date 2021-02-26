import VGalleryUploader from "./components/GalleryUploader.vue";

const VuetifyGalleryUploader = {
  install(Vue) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("v-gallery-uploader", VGalleryUploader);
  }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VuetifyGalleryUploader);
}

export default VuetifyGalleryUploader;
