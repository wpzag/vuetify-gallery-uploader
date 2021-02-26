<template>
  <span>
    <v-file-input
      color="grey"
      v-show="false"
      prepend-icon=""
      multiple
      hide-input
      @change="submit"
      class="pa-0 ma-0"
      ref="uploader"
    />
    <icon-button
      name="Upload Image"
      icon="mdi-image-plus"
      @clicked="$refs.uploader.$refs.input.click()"
    ></icon-button>

    <v-dialog v-model="dialog" width="800px">
      <v-card class="overflow-hidden">
        <image-editor
          @image-edited="imageEdited"
          @image-removed="imageRemoved"
          @reset-all="resetAll"
          :selected="selected"
          :images="images"
          :key="imageEditorKey"
          @filters-saved="filtersSaved"
          @filter-mode="filterMode = $event"
          @edit-mode="editMode = $event"
        />

        <gallery-selection
          style="min-height: 160px"
          class="pt-5"
          @selected="gallerySelected"
          :selected="selected"
          :images="images"
          @loading="loading = $event"
        />
        <discard-changes-dialog
          @close="discardChanges"
          @cancel="discardChangesDialog = false"
          v-model="discardChangesDialog"
        />

        <v-fade-transition>
          <v-overlay :absolute="true" :opacity="1" :value="loading">
            <!-- Loader1 -->

            <div class="loading">
              <h2>pushing pixels</h2>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </v-overlay>
        </v-fade-transition>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import ImageEditor from "./image-editor/ImageEditor";
import GallerySelection from "./GallerySelection";
import DiscardChangesDialog from "./image-editor/DiscardChangesDialog";
import IconButton from "./image-editor/IconButton";

export default {
  name: "v-gallery-uploader",
  components: {
    IconButton,
    DiscardChangesDialog,
    GallerySelection,
    ImageEditor
  },

  data() {
    return {
      loading: true,
      images: [],
      originalImages: [],
      selected: 0,
      imageEditorKey: 1,
      discardChangesDialog: false,
      deleted: null,
      filterMode: false,
      editMode: false,
      newSelectedImage: null,
      items: null,
      dialog: false
    };
  },
  computed: {
    selectedImage() {
      return this.images[this.selected];
    }
  },
  created() {
    this.init();
  },
  methods: {
    submit(files) {
      this.items = files;
      this.dialog = true;
      this.init();
    },
    discardChanges() {
      this.selected = this.newSelectedImage;
      this.discardChangesDialog = false;
    },
    gallerySelected(gallery) {
      if (!this.filterMode && !this.editMode) return (this.selected = gallery);
      this.newSelectedImage = gallery;
      this.discardChangesDialog = true;
      this.editMode = false;
      this.filterMode = false;
    },
    init() {
      console.log("init");
      const resizeValue = 0.35;
      this.items.forEach(file => {
        const fileName = file.name;
        let reader = new FileReader();
        reader.onloadend = event => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const elem = document.createElement("canvas");
            elem.width = img.width * resizeValue;
            elem.height = img.height * resizeValue;
            const ctx = elem.getContext("2d");
            ctx.drawImage(img, 0, 0, elem.width, elem.height);
            ctx.canvas.toBlob(
              blob => {
                const file = new File([blob], fileName, {
                  type: `image/jpeg`,
                  lastModified: Date.now()
                });
                this.getImageFromFile(file);
              },
              "image/jpeg",
              1
            );
          };
        };

        reader.readAsDataURL(file);
      });
    },
    getImageFromFile(file) {
      let reader = new FileReader();
      reader.onloadend = () => {
        let fileData = reader.result;
        this.images.push(fileData);
        this.originalImages.push(fileData);
      };

      reader.readAsDataURL(file);
    },
    imageEdited(image) {
      this.$set(this.images, image.index, image.src);
      this.imageEditorKey++;
    },
    filtersSaved(image) {
      // console.log(image);
      this.$set(this.images, image.index, image.src);
      this.imageEditorKey++;
    },
    imageRemoved(image) {
      this.selected = image.index > 1 ? image.index - 1 : 0;

      this.$delete(this.images, image.index);

      this.imageEditorKey++;
    },
    resetAll() {
      this.$set(this.images, this.selected, this.originalImages[this.selected]);
      this.imageEditorKey++;
    },
    add() {}
  }
};
</script>
<style scoped>
.loading {
  text-align: center;
}
.loading h2 {
  color: #ccc;
  margin: 0;
  font: 0.8em verdana;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.loading span {
  display: inline-block;
  vertical-align: middle;
  width: 0.6em;
  height: 0.6em;
  margin: 0.19em;
  background: #007db6;
  border-radius: 0.6em;
  animation: loading 1s infinite alternate;
}

/*
   * Dots Colors
   * Smarter targeting vs nth-of-type?
   */
.loading span:nth-of-type(2) {
  background: #008fb2;
  animation-delay: 0.2s;
}
.loading span:nth-of-type(3) {
  background: #009b9e;
  animation-delay: 0.4s;
}
.loading span:nth-of-type(4) {
  background: #00a77d;
  animation-delay: 0.6s;
}
.loading span:nth-of-type(5) {
  background: #00b247;
  animation-delay: 0.8s;
}
.loading span:nth-of-type(6) {
  background: #5ab027;
  animation-delay: 1s;
}
.loading span:nth-of-type(7) {
  background: #a0b61e;
  animation-delay: 1.2s;
}

/*
   * Animation keyframes
   * Use transition opacity instead of keyframes?
   */
@keyframes loading {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
