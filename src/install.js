import GalleryUploader from "./components/GalleryUploader.vue";

const GalleryUploader = {
  install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("gallery-uploader", GalleryUploader);
  }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(GalleryUploader);
}

export default GalleryUploader;
