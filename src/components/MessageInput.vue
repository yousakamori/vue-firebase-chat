<template>
  <v-flex v-if="isLoggedin" class="my-3" xs12 sm10>
    <v-form ref="messageForm" v-model="valid" @submit.prevent="addMessage">
      <v-text-field
        ref="messageText"
        v-model="newMessage"
        :rules="required"
        label="message"
        prepend-inner-icon="mdi-emoticon"
        append-outer-icon="mdi-send"
        required
        clear-icon="mdi-close-circle"
        clearable
        @click:clear="clearMessage"
        @click:prepend-inner="toggleEmojiPicker"
        @click:append-outer="addMessage"
        @blur="$refs.messageForm.resetValidation()"
      ></v-text-field>
      <v-dialog v-model="dialog" :hide-overlay="true" width="325px">
        <VEmojiPicker
          :pack="pack"
          :show-search="false"
          :emojis-by-row="8"
          label-search="search"
          @select="selectEmoji"
        />
      </v-dialog>
    </v-form>
  </v-flex>
  <v-flex v-else class="my-3" xs12 sm10>
    <p class="font-weight-medium headline red--text">
      Sign in. with your Google Account.
    </p>
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
import VEmojiPicker from "v-emoji-picker";
import packData from "v-emoji-picker/data/emojis.json";

export default {
  name: "MessageInput",

  components: {
    VEmojiPicker
  },
  data: () => ({
    newMessage: "",
    valid: true,
    pack: packData,
    required: [v => !!(v + "").trim() || "message is required"],
    dialog: false
  }),
  computed: {
    ...mapGetters(["isLoggedin", "user"])
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.inputFocus();
      }
    }
  },
  mounted() {
    this.inputFocus();
  },
  methods: {
    async addMessage() {
      if (!this.$refs.messageForm.validate()) {
        return;
      }

      await this.$store.dispatch("addMessage", {
        content: this.newMessage,
        uid: this.user.uid
      });
      this.clearMessage();
    },
    selectEmoji(dataEmoji) {
      if (!this.dialog) {
        return;
      }

      if (!this.newMessage) {
        this.newMessage = "";
      }

      this.newMessage += dataEmoji.emoji;
      this.dialog = false;
      this.inputFocus();
    },
    toggleEmojiPicker() {
      this.dialog = !this.dialog;
    },
    inputFocus() {
      this.$refs.messageText.focus();
    },
    clearMessage() {
      this.$refs.messageForm.resetValidation();
      this.newMessage = "";
    }
  }
};
</script>
