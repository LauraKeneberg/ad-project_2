import fb from 'firebase'

class Ad {
  constructor (title, desc, ownerId, src = '', promo = false, id = null) {
    this.title = title
    this.desc = desc
    this.ownerId = ownerId
    this.src = src
    this.promo = promo
    this.id = id
  }
}

export default {
state: {
		ads:[]
	},
mutations: {
		createAd(state, payload){
			state.ads.push(payload)
		},
    loadAds (state, payload) {
	state.ads = payload
},
updateAd (state, {title, desc, id}) {
    const ad = state.ads.find(a => {
      return a.id === id
    })
    ad.title = title
    ad.desc = desc
  }
},
actions: {
  async createAd ({commit, getters}, payload) {
        commit('clearError')
        commit('setLoading', true)

        const image = payload.image
        const imageExt = payload.image.name.slice(payload.image.name.lastIndexOf("."))
        try {
          const newAd = new Ad(
            payload.title,
            payload.desc,
            getters.user.id,
            '',
            payload.promo,
            payload.id
          )
          await fb.database().ref('ads').push(newAd)
          .then(res => {
            fb.storage().ref().child(`ads/${res.key + imageExt}`).put(image)
            .then(snapshot => {
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                const src = downloadURL
                fb.database().ref("ads").child(res.key).update({ src })
                commit('setLoading', false)
                commit('createAd', {
                  ...newAd,
                  id: res.key,
                  src
                })
              })
            })
          })
        } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
}
},
async fetchAds ({commit}) {
      commit('clearError')
      commit('setLoading', true)

      const resultAds = []

      try {
        const fbVal = await fb.database().ref('ads').once('value')
        const ads = fbVal.val()

        Object.keys(ads).forEach(key => {
          const ad = ads[key]
          resultAds.push(
            new Ad(
              ad.title,
              ad.desc,
              ad.ownerId,
              ad.src,
              ad.promo, key)
          )
        })

        commit('loadAds', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
async updateAd ({commit},{title,desc,id}) {
commit('clearError')
commit('setLoading', true)
try {
await fb.database().ref("ads").child(id).update({ title, desc })
commit('updateAd',{ title, desc, id})
commit('setLoading', false)
} catch (error) {
commit('setError', error.message)
commit('setLoading', false)
throw error
}
}

},
getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return ad.promo
      })
    },
    myAds (state, getters) {
      return state.ads.filter(ad => {
return ad.ownerId == getters.user.id
	})
},

    adById (state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  }
}
