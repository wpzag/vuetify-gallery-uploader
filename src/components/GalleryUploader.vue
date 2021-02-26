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
      @clicked="addImage"
    ></icon-button>

    <v-dialog
      v-model="dialog"
      width="80%"
      persistent
      overlay-opacity=".9"
      overlay-color="black"
    >
      <v-card dark class="overflow-hidden" elevation="5">
        <!--        <v-btn-->
        <!--          class="mx-2 pa-2"-->
        <!--          fab-->
        <!--          dark-->
        <!--          large-->
        <!--          absolute-->
        <!--          style="top:15px;right:1px"-->
        <!--          @click="close"-->
        <!--        >-->
        <!--          <v-icon dark>mdi-close</v-icon>-->
        <!--        </v-btn>-->
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
          class="pa-6"
          @selected="gallerySelected"
          :selected="selected"
          :images="images"
          @loading="loading = $event"
          @addImage="addImage"
        />
        <discard-changes-dialog
          @close="discardChanges"
          @cancel="discardChangesDialog = false"
          v-model="discardChangesDialog"
        />

        <v-fade-transition>
          <v-overlay :absolute="true" :opacity="1" :value="loading">
            <v-cool-loader />
          </v-overlay>
        </v-fade-transition>
        <v-divider />

        <v-card-actions class="pt-5 pb-5">
          <v-spacer />
          <v-btn @click="close" color="error" text>Cancel</v-btn>
          <v-btn @click="emitFinalImages">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
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

      filterMode: false,
      editMode: false,
      newSelectedImage: null,
      items: [],
      dialog: false
    };
  },
  computed: {
    selectedImage() {
      return this.images[this.selected];
    }
  },

  methods: {
    emitFinalImages() {
      this.$emit("submit", this.images);
    },
    close() {
      this.loading = true;
      this.images = [];
      this.originalImages = [];
      this.selected = 0;
      this.discardChangesDialog = false;

      this.filterMode = false;
      this.editMode = false;
      this.newSelectedImage = null;
      this.items = [];
      this.dialog = false;
      this.imageEditorKey++;
    },
    addImage() {
      this.$refs.uploader.$refs.input.click();
    },
    submit(files) {
      this.loading = true;

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
