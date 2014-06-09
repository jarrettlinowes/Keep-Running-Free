ActiveAdmin.register Post do
  index do
  	column :id
    column :title
    column :author
    column :status
    column :category
    column :tags_count
    column :groups_count
    column :published_on
    column :updated_at
    default_actions
  end

  filter :author
  filter :title
  filter :intro
  filter :status
  filter :created_at
  filter :updated_at
  filter :published_on
  filter :views
  filter :category
  #filter :tagged_with, as: :string

	form do |f|
		f.inputs do
      f.input :published_on
  		f.input :title
      #f.input :title_picture_id
      f.input :title_picture, as: :select, collection: Ckeditor::Picture.all.map(&:id)
  		f.input :intro, :input_html => {:class => "ckeditor"}
  		f.input :body, :input_html => {:class => "ckeditor"}
  		f.input :author
  		f.input :status, :collection => ['published','p_featured','f_training','f_nutrition','f_review']
      f.input :category, :collection => ['running','training','traininggear','nutrition','reviews']
      f.input :tag_list, :hint => "Comma delimited ~ #{Post.tag_list_for_display_on :tags}"
      f.input :group_list, :hint => "Comma delimited ~ #{Post.tag_list_for_display_on :groups}"
  	end
  	f.buttons
	end
  show do |post|
    attributes_table do
      row :id
      row :title
      row :title_picture_id
      row :intro
      row :body
      row :status
      row :author
      row :created_at
      row :updated_at
      row :published_on
      row :category
      row :tag_list
      row :group_list
      row :views
    end
  end
end
