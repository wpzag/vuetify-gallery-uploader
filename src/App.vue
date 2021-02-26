<template>
  <v-app>
    <v-main class=" text-center" style="padding-top: 250px;">
      <gallery-uploader style="margin:0 auto" />
    </v-main>
  </v-app>
</template>

<script>
import GalleryUploader from "./components/GalleryUploader.vue";

export default {
  components: { GalleryUploader },

  name: "App",

  data: () => ({
    images: [],
    dialog: false
  }),
  created() {
    this.fakeIMAGES();
  },
  methods: {
    submit(files) {
      this.images = files;

      setTimeout(() => {
        this.dialog = true;
      }, 500);
    },
    fakeIMAGES() {
      let urls = [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2551&q=80",
        "https://images.unsplash.com/photo-1614059632169-522876ce04c8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3068&q=80",
        "https://images.unsplash.com/photo-1613975570624-b3be42ffdebe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3068&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3744&q=80"
      ];
      let i = 0;
      urls.forEach(url => {
        fetch(url).then(async response => {
          const contentType = response.headers.get("content-type");
          const blob = await response.blob();
          const file = new File([blob], "mesh" + i, { contentType });
          this.images.push(file);
          i++;
        });
      });
    }
  }
};
</script>
