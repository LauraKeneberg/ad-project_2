<template>
	<v-container>
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<h1 class="text--secondary mb-3 mt-3">Создание объявление</h1>
				<v-form v-model="valid" ref="form" validation>
					<v-text-field
					name="title"
					label="Название объявления"
					type="text"
					v-model="title"
					required
					:rules="[ v => !!v || 'Title is required']"
					>
					</v-text-field>
					<v-textarea
					name="description"
					label="Описание объявления"
					type="text"
					v-model="description"
					:rules="[ v => !!v || 'Description is required']"
					class="mb-3"
					></v-textarea>
					</v-form>

					<v-layout  row>
						<v-flex xs12>
						<v-btn
						class="mt-3"
						color="warning"
						@click="triggerUpload"
						>Загрузить<v-icon right dark>mdi-cloud-upload</v-icon>
						</v-btn>
						<input
	ref="fileInput"
	type="file"
	style="display: none;"
	accept="image/*"
	@change="onFileChange"
	>
</v-flex>
					</v-layout>
					<v-layout row>
						<v-flex xs12>
						<img
						:src="imageSrc"
						height="150"

						v-if="imageSrc">
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-flex xs12>
						<v-switch
v-model="promo"
label="Добавить в слайдер?"
></v-switch>
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-flex xs12>
	<v-spacer></v-spacer>

	<v-btn
	color="success"
	@click="createAd"
	:loading="loading"
	:disabled:="!valid || !image || loading"
	>Создать объявление
</v-btn>

</v-flex>

					</v-layout>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
export default {
	data () {
		return {
			valid: false,
			title: "",
			description: "",
			promo: false,
			image: null,
			imageSrc: ''

		}
	},
	computed: {
loading() {
		return this.$store.getters.loading
	}
},

	methods: {
		createAd(){
	if (this.$refs.form.validate() && this.image){
	const ad = {
	title: this.title,
	desc: this.description,
	promo: this.promo,
	image: this.image
	}
	this.$store.dispatch("createAd", ad)
		.then(() => {
		this.$router.push("/list")
		})
		.catch(() => {})
	}
},

		triggerUpload () {
	this.$refs.fileInput.click()
},
onFileChange (event) { //обработка картинки для загрузки в фронтэнд
const file = event.target.files[0] //свойство в котором хранится файл
const reader = new FileReader() //библиотека
reader.onload = () => {			//прослушка события  на когда закончит ридер чтение файла
this.imageSrc = reader.result
}
reader.readAsDataURL(file) //передача файла который мы подгрузили
this.image = file
}

}
}
</script>
