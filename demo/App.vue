<template>
	<div class="min-h-screen bg-[#e3e3ce] p-5">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-center text-white text-4xl mb-10 drop-shadow-lg">
				Vòng Quay May Mắn
			</h1>

			<div class="flex flex-col items-center justify-center">
				<SpinWheel
					ref="spinWheel"
					:items="foodItems"
					:size="600"
					:duration="4000"
					:spins="8"
					pointerPosition="top"
					:pointerColor="'#ff0000'"
					:showCenterButton="true"
					spinButtonText="QUAY SỐ"
					:centerButtonSize="100"
					:centerButtonFontSize="18"
					:borderWidth="4"
					borderColor="#ffffff"
					textColor="#000000"
					:fontSize="14"
					@spin-start="handleSpinStart"
					@spin-end="handleFoodSelected"
				/>
				<div
					v-if="foodSelected && !isSpinning"
					class="mt-5 p-4 bg-gradient-to-r from-pink-400 to-red-500 rounded-lg text-white animate-bounce"
				>
					<h3 class="text-xl">🎉 Chúc mừng: {{ foodSelected.label }} 🎉</h3>
				</div>
			</div>
		</div>
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
			foodItems: [
				{
					id: 1,
					label: 'Green',
					color: '#E8D5FF',
					textColor: '#6B2C91',
					value: 'hoa-hiep',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 2,
					label: 'Ron',
					color: '#D4A574',
					textColor: '#8B4513',
					value: 'bach-bao',
					image: 'https://picsum.photos/seed/picsum/200/300',
					imageSize: 80
				},
				{
					id: 3,
					label: 'Alex',
					color: '#B8E6FF',
					textColor: '#0066CC',
					value: 'tinh-long',
					image: 'https://picsum.photos/200/300?grayscale',
					imageSize: 80
				},
				{
					id: 4,
					label: 'July',
					color: '#E0F0FF',
					textColor: '#1E88E5',
					value: 'huyen-thien',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 5,
					label: 'Ellis',
					color: '#FFE0E0',
					textColor: '#C62828',
					value: 'chien-than',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				},
				{
					id: 6,
					label: 'Nate',
					color: '#F5E6D3',
					textColor: '#8B6914',
					value: 'kim-ngan',
					image: 'https://picsum.photos/200/300',
					imageSize: 80
				}
			]
		}
	},
	methods: {
		// Mock API simulator - returns a random winning item after a delay
		async mockApiCall() {
			return new Promise((resolve) => {
				// Simulate random API response time between 1-3 seconds
				const delay = Math.random() * 2000 + 1000

				setTimeout(() => {
					// Randomly select a winning item ID
					const randomItem = this.foodItems[Math.floor(Math.random() * this.foodItems.length)]
					console.log(`API responded after ${delay.toFixed(0)}ms with winning item:`, randomItem.label)

					resolve({
						itemId: randomItem.id,
						itemLabel: randomItem.label
					})
				}, delay)
			})
		},

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
		}
	}
}
</script>

