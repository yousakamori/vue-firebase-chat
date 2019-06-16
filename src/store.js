import Vue from "vue";
import Vuex from "vuex";
import firebase from "@/plugins/firebase";
import { vuexfireMutations, firestoreAction } from "vuexfire";

const firestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    user: null,
    users: [],
    messages: [],
    isLoaded: false
  },
  mutations: {
    ...vuexfireMutations,
    setCredential(state, user) {
      state.user = user;
    },
    setIsLoaded(state, isLoaded) {
      state.isLoaded = isLoaded;
    }
  },
  getters: {
    messages: state => {
      return state.messages.map(message => {
        message.user = state.users.find(user => user.uid === message.uid);
        return message;
      });
    },
    user: state => state.user,
    users: state => state.users,
    isLoaded: state => state.isLoaded,
    isLoggedin: state => !!state.user
  },
  actions: {
    initUsers: firestoreAction(({ bindFirestoreRef }) => {
      const usersCollection = firestore.collection("users");
      bindFirestoreRef("users", usersCollection);
    }),
    initMessages: firestoreAction(({ bindFirestoreRef }) => {
      const messagesCollection = firestore
        .collection("messages")
        .orderBy("createdAt", "desc");
      bindFirestoreRef("messages", messagesCollection);
    }),
    signIn() {
      firebase.auth().signInWithRedirect(provider);
    },
    async signOut({ commit }) {
      await firebase.auth().signOut();
      commit("setCredential", null);
    },
    async setCredential({ commit }, user) {
      if (!user) return;
      const usersCollection = firestore.collection("users");
      await usersCollection.doc(user.email).set({
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        icon: user.photoURL
      });

      commit("setCredential", {
        name: user.displayName,
        uid: user.uid,
        icon: user.photoURL
      });
    },
    addMessage(context, { content, uid }) {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
      firestore
        .collection("messages")
        .add({
          content,
          uid,
          createdAt: serverTimestamp,
          updatedAt: serverTimestamp
        })
        .then(docRef => {
          console.log(`${docRef.id} successfully added!`);
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeMessage(context, id) {
      firestore
        .collection("messages")
        .doc(id)
        .delete()
        .then(function() {
          console.log("message successfully deleted!");
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadComplete({ commit }) {
      commit("setIsLoaded", true);
    }
  }
});
