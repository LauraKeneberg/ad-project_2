<template>
  <v-app>
  <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Измерение
          </v-list-item-title>
          <v-list-item-subtitle>
            Измерительные приборы
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item-group color="primary">
<v-list-item
          v-for="link in links"
          :key="link.title"
          :to="link.url"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
 <v-list-item
 v-if="isUserLoggedIn"
 @click="onLogout"
 >
 <v-list-item-icon>
 <v-icon>mdi-exit-to-app</v-icon>
 </v-list-item-icon>
 <v-list-item-content>
 <v-list-item-title>Выйти</v-list-item-title>
 </v-list-item-content>
 </v-list-item>


        </v-list-item-group>
      </v-list>
  </v-navigation-drawer>
  <v-app-bar app dark color="primary">
    <v-app-bar-nav-icon
    @click="drawer = !drawer"
    class="hidden-md-and-up"
    ></v-app-bar-nav-icon>



    <v-toolbar-title>
          <router-link
    to="/"
    tag="span"
    class="pointer"
       >Главная</router-link>
    </v-toolbar-title>
<v-spacer></v-spacer>



    <v-toolbar-items class="hidden-sm-and-down">
       <v-btn
       v-for="link in links"
       :key="link.title"
       :to="link.url"
       text
       ><v-icon left>{{ link.icon }}</v-icon>{{ link.title }}</v-btn>
       <v-btn
       text
       @click="onLogout"
       v-if="isUserLoggedIn"
       >
       <v-icon left>mdi-exit-to-app</v-icon>
         Выйти
       </v-btn>

    </v-toolbar-items>
  </v-app-bar>
  <v-main>
    <router-view></router-view>
  </v-main>
  <template v-if="error">
    <v-snackbar
    :timeout="5000"
    :multi-line="true"
    color="error"
    @input="closeError"
    :value="true"
    >
      {{ error }}
      <v-btn text dark @click.native="closeError">Close</v-btn>
    </v-snackbar>
  </template>


  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
   },
   isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
},
links () {
      if (this.isUserLoggedIn) {
        return [
        {title:"Заказчики", icon:"mdi-bookmark-multiple-outline", url:"/orders"},
        {title:"Новое объявление", icon:"mdi-note-plus-outline", url:"/new"},
        {title:"Мои объявления", icon:"mdi-view-list-outline", url:"/list"}
        ]
      } else {
        return [
        {title:"Авторизация", icon:"mdi-lock", url:"/login"},
        {title:"Регистрация", icon:"mdi-face", url:"/registration"},
        ]
      }
    }

},
methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout () {
          this.$store.dispatch('logoutUser')
      this.$router.push("/")
        }

 }

}
</script>
<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
