<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/code">
          <v-list-tile-action>
            <v-icon>code</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Code</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app prominent>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <span>NEET</span>
        <span class="font-weight-light">Chat</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="isLoaded">
        <div v-if="isLoggedin" class="text-xs-center">
          <v-menu v-model="menu" :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn flat fab v-on="on">
                <v-avatar>
                  <img :src="user.icon" />
                </v-avatar>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img :src="user.icon" :alt="user.name" />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ user.email }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-divider></v-divider>
              <v-list>
                <v-list-tile @click="signOut">
                  <v-list-tile-title>Signout</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
        </div>
        <v-btn v-if="!isLoggedin" flat @click="signIn">Signin Google</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <Loading v-if="!isLoaded" />
      <router-view v-else />
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import auth from "@/plugins/auth";
import Loading from "@/components/Loading";

export default {
  name: "App",
  components: {
    Loading
  },
  data: () => ({
    drawer: null,
    menu: false
  }),
  computed: {
    ...mapGetters(["user", "users", "messages", "isLoaded", "isLoggedin"])
  },
  async mounted() {
    let user;
    if (!this.user) user = await auth();
    await Promise.all([
      this.user
        ? Promise.resolve()
        : this.$store.dispatch("setCredential", user || null),
      this.users.length ? Promise.resolve() : this.$store.dispatch("initUsers"),
      this.messages.length
        ? Promise.resolve()
        : this.$store.dispatch("initMessages")
    ]);
    this.$store.dispatch("loadComplete");
  },
  methods: {
    ...mapActions(["signOut", "signIn"])
  }
};
</script>
