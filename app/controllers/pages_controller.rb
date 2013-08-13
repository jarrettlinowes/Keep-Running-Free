class PagesController < ApplicationController
	def home
		@current_section = 'home'
		@recent_feature = Post.p_featured.order("published_on DESC")
	end

	def about
		@current_section = 'about'
		@authors = Author.all
	end

	def running
		@current_section = 'running'
	end

	def training
		@current_section = 'training'
	end

	def running101
		@current_section = 'running101'
	end

	def traininggear
		@current_section = 'training_gear'
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