<template>
      <v-dialog
        v-model="modal"
        width="400px"
      >
       <template v-slot:activator="{ on }"><v-btn
v-on="on"
color="primary"
>
Приобрести</v-btn></template>
<v-card>
<v-container>
<v-layout row>
<v-flex xs12>
<v-card-title>
<h1 class="text--primary">Вы хотите купить это?</h1>
</v-card-title>
</v-flex>
</v-layout>
<v-divider></v-divider>
<v-layout row>
<v-flex xs12>
<v-card-text>
  <v-text-field
name="name"
label="Ваше имя"
type="text"
v-model="name"

></v-text-field>
<v-textarea
name="phone"
label="Ваш телефон"
type="text"
v-model="phone"
></v-textarea>
</v-card-text>
</v-flex>
</v-layout>
<v-divider></v-divider>
<v-layout row>
<v-flex xs12>
<v-card-actions>
<v-spacer></v-spacer>
<v-btn
@click="onCancel"
:disabled="localLoading"
>
Закрыть
</v-btn>
<v-btn
color="success"
 @click="onSave"
 :disabled="localLoading"
 :loading="localLoading"

 >
 Купить!
</v-btn>
</v-card-actions>
</v-flex>
</v-layout>
          </v-container>
        </v-card>
      </v-dialog>
</template>
<script>
	export default {
    props: ['ad'],
		data() {
			return {
				modal: false,
        name: "",
        phone: "",
localLoading: false


			}
		},
    methods: {
	onCancel (){
this.name = ""
this.phone = ""
	this.modal = false


},
	onSave (){
    if (this.name !== '' && this.phone !== '') {
this.localLoading = true
this.$store.dispatch('createOrder', {
name: this.name,
phone: this.phone,
adId: this.ad.id,
ownerId: this.ad.ownerId
})
.finally(() => {
this.localLoading = false
this.name = ""
this.phone = ""
this.modal = false
})
}
}
}
}

</script>
