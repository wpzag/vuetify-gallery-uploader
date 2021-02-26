<template>
  <v-card dark color="black" class="text-center">
    <v-slide-y-transition>
      <div v-if="!editMode && !filterMode">
        <icon-button name="Edit" icon="mdi-pencil-outline" @clicked="edit" />
        <icon-button name="Adjustments" icon="mdi-auto-fix" @clicked="filter" />
        <icon-button name="Reset All" icon="mdi-restore" @clicked="resetAll" />
        <delete-button @delete="remove" />
      </div>
    </v-slide-y-transition>

    <v-fab-transition>
      <div v-show="editMode && cropper">
        <icon-button name="Crop" icon="mdi-crop" @clicked="crop" />
        <icon-button name="Redo" icon="mdi-redo" @clicked="rotate('right')" />
        <icon-button name="Undo" icon="mdi-undo" @clicked="rotate('left')" />
        <icon-button name="Zoom in" icon="mdi-magnify-plus" @clicked="zoomIn" />
        <icon-button
          name="Zoom out"
          icon="mdi-magnify-minus"
          @clicked="zoomOut"
        />
        <icon-button name="Reset" icon="mdi-restore" @clicked="reset" />
        <div style="width: 20px;"></div>
        <icon-button name="Save" icon="mdi-check-bold" @clicked="save" />
        <icon-button name="Close" icon="mdi-close" @clicked="close" />
      </div>
    </v-fab-transition>
  </v-card>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import IconButton from "./IconButton";
import DeleteButton from "./DeleteButton";

export default {
  name: "action-buttons",
  components: { DeleteButton, IconButton },
  props: ["selected", "selectedImageSrc", "filterMode"],

  data() {
    return {
      cropper: null,
      originalImage: null,
      editMode: false
    };
  },
  watch: {
    editMode() {
      this.$emit("edit-mode", this.editMode);
    },
    selected() {
      if (this.editMode) {
        this.resetAll();
        this.close();
        this.$emit("edit-mode", this.editMode);
      }
    }
  },
  mounted() {
    this.$emit("edit-mode", this.editMode);
  },
  methods: {
    edit() {
      this.initCroppper(this.$parent.$refs.selectedImage);
      this.editMode = true;
    },

    initCroppper(image) {
      // console.log(image.src);
      this.originalImage = image.src;
      if (this.cropper) return this.cropper.replace(image);
      this.cropper = new Cropper(image, {
        autoCrop: true,
        aspectRatio: 1,
        autoCropArea: 1,
        viewMode: 1,
        responsive: true,
        // movable: true,
        // modal: false,
        dragMode: "move",
        background: false,
        zoomable: true,
        zoomOnWheel: false
      });
    },
    save() {
      this.cropper
        .getCroppedCanvas({
          // height: 500,
          // width: 500,
          // maxWidth: 500,
          // maxHeight: 500
        })
        .toBlob(
          blob => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              let image = reader.result;
              this.$emit("image-edited", { index: this.selected, src: image });

              // console.log(base64data);
            };
          },
          "image/png",
          0.5
        );

      this.cropper.destroy();
      this.cropper = null;
      this.close();
    },
    crop() {
      this.cropper.crop();
    },
    zoomIn() {
      this.cropper.zoom(0.1);
    },
    zoomOut() {
      this.cropper.zoom(-0.1);
    },
    rotate(direction) {
      direction === " right "
        ? this.cropper.rotate(-45)
        : this.cropper.rotate(45);
    },
    reset() {
      if (this.cropper) this.cropper.reset();
    },
    resetAll() {
      if (this.cropper) this.cropper.reset();
      this.$emit("reset-all");

      this.cropper = null;
    },
    remove() {
      this.$emit("image-removed", {
        index: this.selected
        // src: this.selected
      });
      if (this.cropper) this.cropper.reset();
      this.cropper = null;
    },
    close() {
      this.editMode = false;
      this.$emit("closed");
      if (this.cropper) this.cropper.destroy();
      this.cropper = null;
    },
    filter() {
      this.$emit("filter");
    }
  }
};
</script>
