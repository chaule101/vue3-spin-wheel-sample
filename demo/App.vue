<template>
	<div class="min-h-screen flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-10">
		<h1 class="text-center text-blue text-4xl mb-10 drop-shadow-lg">
			Spin Wheel Demo
		</h1>

		<div class="flex flex-col items-center justify-center w-full max-w-[600px] aspect-square">
			<SpinWheel
				ref="spinWheel"
				:items="nameItems"
				spinButtonText="RUN"
				@spin-start="handleSpinStart"
				@spin-end="handleFoodSelected"
			/>
		</div>

		<!-- Congratulations Modal Overlay -->
		<Transition name="modal">
			<div
				v-if="foodSelected && !isSpinning"
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
				@click.self="closeCongrats"
			>
				<!-- Backdrop -->
				<div class="absolute inset-0 bg-black bg-opacity-50"></div>

				<!-- Confetti Container -->
				<div class="confetti-container absolute inset-0 pointer-events-none overflow-hidden">
					<div
						v-for="i in 50"
						:key="i"
						class="confetti"
						:style="getConfettiStyle(i)"
					></div>
				</div>

				<!-- Modal Dialog -->
				<div class="modal-dialog relative bg-white rounded-lg shadow-2xl w-full overflow-hidden max-w-[1000px] sm:mx-4">
					<!-- Yellow Header -->
					<div class="bg-yellow-400 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
						<h2 class="text-lg sm:text-xl font-bold text-black">The prize is...</h2>
						<button
							@click="closeCongrats"
							class="text-black hover:text-gray-700 text-xl sm:text-2xl font-bold leading-none"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<!-- Content -->
					<div class="px-4 py-6 sm:px-6 sm:py-8 text-center">
						<h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
							{{ foodSelected.label }}
						</h3>
						<div v-if="foodSelected.image" class="mt-2">
							<img
								:src="foodSelected.image"
								:alt="foodSelected.label"
								class="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
							/>
						</div>
					</div>
					<!-- Action Buttons -->
					<div class="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 flex justify-end gap-3">
						<button
							@click="closeCongrats"
							class="px-4 py-2 sm:px-6 sm:py-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-50 transition-colors text-sm sm:text-base"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script>
import { SpinWheel } from '../src/index'

export default {
	name: 'App',
	components: {
		SpinWheel
	},
	data() {
		return {
			foodSelected: null,
			isSpinning: false,
			nameItems: [
				{
					id: 1,
					label: 'Green',
					// color: '#E8D5FF',
					// textColor: '',
					value: 'hoa-hiep',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 2,
					label: 'Ron',
					// color: '#D4A574',
					// textColor: '#8B4513',
					value: 'bach-bao',
					image: 'https://picsum.photos/seed/picsum/200/300',
					imageSize: 80
				},
				{
					id: 3,
					label: 'Alex',
					// color: '#B8E6FF',
					// textColor: '#0066CC',
					value: 'tinh-long',
					image: 'https://picsum.photos/200/300?grayscale',
					imageSize: 80
				},
				{
					id: 4,
					label: 'July',
					// color: '#E0F0FF',
					// textColor: '#1E88E5',
					value: 'huyen-thien',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 5,
					label: 'Ellis',
					// color: '#FFE0E0',
					// textColor: '#C62828',
					value: 'chien-than',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 6,
					label: 'Nate',
					// color: '#F5E6D3',
					// textColor: '#8B6914',
					value: 'kim-ngan',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				}
			]
		}
	},
	methods: {
		// manual confetti style
		getConfettiStyle(index) {
			const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493']
			const color = colors[Math.floor(Math.random() * colors.length)]
			const left = Math.random() * 100
			const delay = Math.random() * 0.5
			const duration = 2 + Math.random() * 2
			const size = 8 + Math.random() * 8

			return {
				left: left + '%',
				backgroundColor: color,
				width: size + 'px',
				height: size + 'px',
				animationDelay: delay + 's',
				animationDuration: duration + 's'
			}
		},

		// Mock API simulator - returns a random winning item after a delay
		async mockApiCall() {
			return new Promise((resolve) => {
				// Simulate random API response time between 1-3 seconds
				const delay = Math.random() * 2000 + 1000

				setTimeout(() => {
					// Randomly select a winning item ID
					const randomItem = this.nameItems[Math.floor(Math.random() * this.nameItems.length)]
					console.log(`API responded after ${delay.toFixed(0)}ms with winning item:`, randomItem.label)

					resolve({
						itemId: randomItem.id,
						itemLabel: randomItem.label
					})
				}, delay)
			})
		},

		// BE handle gọi API gọi quà
		async handleSpinStart() {
			console.log('🎯 Spin started! Calling API...')

			// Clear the previous selected item and mark as spinning
			this.foodSelected = null
			this.isSpinning = true

			try {
				// Simulate API call
				const data = await this.mockApiCall()

				console.log('✅ Server returned winning item ID:', data.itemId)

				// Set the result to the spin wheel
				this.$refs.spinWheel.setSpinResult(data.itemId)
			} catch (error) {
				console.error('❌ Error fetching spin result:', error)
				// Handle error - you might want to stop the spin or show an error message
				this.isSpinning = false
			}
		},

		handleFoodSelected(item, index) {
			console.log('🎉 Food wheel spin ended!', item.label, 'at index:', index)
			this.isSpinning = false
			this.foodSelected = item
		},

		closeCongrats() {
			this.foodSelected = null
		}
	}
}
</script>

<style scoped>
	.modal-enter-active,
	.modal-leave-active {
		transition: opacity 0.3s ease;
	}

	.modal-enter-active .modal-dialog,
	.modal-leave-active .modal-dialog {
		transition: all 0.3s ease-out;
	}

	.modal-enter-from {
		opacity: 0;
	}

	.modal-enter-from .modal-dialog {
		opacity: 0;
		transform: scale(0.9) translateY(-20px);
	}

	.modal-leave-to {
		opacity: 0;
	}

	.modal-leave-to .modal-dialog {
		opacity: 0;
		transform: scale(0.95) translateY(-10px);
	}

	/* Confetti Styles */
	.confetti-container {
		z-index: 51;
	}

	.confetti {
		position: absolute;
		top: -10px;
		border-radius: 50%;
		animation: confetti-fall linear forwards;
		opacity: 0;
	}

	@keyframes confetti-fall {
		0% {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
		100% {
			opacity: 0;
			transform: translateY(100vh) rotate(720deg);
		}
	}

	/* Confetti shapes variation */
	.confetti:nth-child(3n) {
		border-radius: 0;
		transform: rotate(45deg);
	}

	.confetti:nth-child(3n+1) {
		border-radius: 50%;
	}

	.confetti:nth-child(3n+2) {
		border-radius: 0;
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 10px solid;
		background: transparent !important;
	}
</style>

