class PagesController < ApplicationController
	def home
		@current_section = 'home'
	end

	def about
		@current_section = 'about'
	end

	def running
		@current_section = 'running'
	end

	def nutrition
		@current_section = 'nutrition'
	end

	def reviews
		@current_section = 'reviews'
	end

	def entertainment
		@current_section = 'entertainment'
	end

	def store
		@current_section = 'krf store'
	end

	def test
		render layout: 'test'
	end
end