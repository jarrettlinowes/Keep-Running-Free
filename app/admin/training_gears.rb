ActiveAdmin.register TrainingGear do
	index do
		column :id
		column :title
		column :gender
		column :status
		column :category
		column :published_on
		column :updated_at
		default_actions
	end

	filter :title
	filter :status
	filter :created_at
	filter :updated_at
	filter :category
	filter :gender

	form do |f|
		f.inputs do
			f.input :published_on
			f.input :title
			f.input :title_picture_id
			f.input :details, :input_html => {:class => "ckeditor"}
			f.input :description, :input_html => {:class => "ckeditor"}
			f.input :gender, :collection => ['men','women']
			f.input :amazon
			f.input :status, :collection => ['published','g_featured']
			f.input :category, :collection => ['endurance','strength_training','speed_&_agility']
		end
		f.buttons
	end
	show do |training_gear|
		attributes_table do
			row :id
			row :title
			row :title_picture_id
			row :details
			row :description
			row :status
			row :created_at
			row :updated_at
			row :published_on
			row :category
		end
	end
end
