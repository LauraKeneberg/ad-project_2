import fb from 'firebase'

class Order {
	constructor(name, phone, adId, done = false, id = null) {
		this.name = name
		this.phone = phone
		this.adId = adId
		this.done = done
		this.id = id
	}
}

export default {
	state: {
		orders: null
	},
	mutations: {
		loadOrders(state, payload) {
			state.orders = payload
		}
	},
	actions: {
		async createOrder({ commit }, { name, phone, adId, ownerId }) {
			const order = new Order(name, phone, adId)
			commit('clearError')
			try {
				await fb.database().ref(`/users/${ownerId}/orders`).push(order)

			} catch (error) {
				commit('setError', error.message)
				throw error
			}
		},
		async fetchOrders({ commit, getters }) {
			commit('setLoading', true)
			commit('clearError')
			try {
				const resultOrders = []
				await fb.database().ref(`/users/${getters.user.id}/orders`).once('value')
				.then(res => {
					const orders = res.val()
					if (orders !== null) {
						Object.keys(orders).forEach(key => {
							const order = orders[key]
							resultOrders.push(
								new Order(
									order.name,
									order.phone,
									order.adId,
									order.done,
									key
								)
							)
						})
					}
					commit('loadOrders', resultOrders)
					commit('setLoading', false)
				})
			} catch (error) {
				commit('setError', error.message)
				commit('setLoading', false)
				throw error
			}
		},
		async markOrderDone({ commit, getters }, payload) {
			commit('clearError')
			try {
				await fb.database().ref(`/users/${getters.user.id}/orders`).child(payload).update({
					done: true
				})

			} catch (error) {
				commit('setError', error.message)
				throw error
			}
		}
	},
	getters: {
		doneOrders(state) {
			return state.orders.filter(order => order.done)
		},
		undoneOrders(state) {
			return state.orders.filter(order => !order.done)
		},
		orders(state, getters) {
			return getters.undoneOrders.concat(getters.doneOrders)
		}

	}
}
