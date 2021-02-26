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
          <v-overlay :absolute="true" :opacity="1" :value="true">
            <v-cool-loader />
          </v-overlay>
        </v-fade-transition>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import "../assets/style.css";

import ImageEditor from "./image-editor/ImageEditor";
import GallerySelection from "./GallerySelection";
import DiscardChangesDialog from "./image-editor/DiscardChangesDialog";
import IconButton from "./image-editor/IconButton";
import VCoolLoader from "./Loader";

export default {
  name: "v-gallery-uploader",
  components: {
    VCoolLoader,
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
