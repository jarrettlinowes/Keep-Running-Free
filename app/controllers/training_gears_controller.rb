class TrainingGearsController < InheritedResources::Base
	before_filter :authorize, except: [:index, :show]

	def index
		@current_section = params[:category] || ''

		# for the carousel
		@most_recent = TrainingGear.published.where(category: @current_section).recent.first

		# bulid posts query, for current section
		@training_gears = TrainingGear.published.where(category: @current_section).recent
		# not including the first one 
		@training_gears = @training_gears.where( "id != #{@most_recent.id}" ) if @most_recent
		# paginate the posts
		@training_gears = @training_gears.page(params[:page]).per(10)

		respond_to do |format|
			format.html
		end
	end

	def show
		@training_gear = TrainingGear.published.find(params[:id])
		@current_section = @training_gear #.categroy

		respond_to do |format|
			format.html
		end
	end

	def new
		@training_gear = TrainingGear.new

		respond_to do |format|
			format.html
		end
	end

	def edit
		@training_gear = TrainingGear.find(params[:id])
	end

	def create
		@training_gear = TrainingGear.new(params[:training_gear])

		respond_to do |format|
			if @post.save
				format.html { redirect_to @post, notice: 'Training Gear Post was successfully created.'}
			else
				format.html { render action: "new" }
			end
		end
	end

	def update
		@training_gear = TrainingGear.find(params[:id])

		respond_to do |format|
			if @training_gear.update_attributes(params[:post])
				format.html { redirect_to @training_gear, notice: 'Training Gear Posts was successfully updated'}
			else
				format.html { render action: "edit"}
			end
		end
	end

	def destroy
		@training_gear = TrainingGear.find(params[:id])
		@training_gear.destroy

		respond_to do |format|
			format.html { redirect_to training_gears_url}
		end
	end
end
