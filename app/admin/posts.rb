ActiveAdmin.register Post do
  index do
  	column :id
    column :title
    column :author
    column :status
    column :category
    column :published_on
    column :updated_at
    default_actions
  end
	form do |f|
		f.inputs do
      f.input :published_on
  		f.input :title
  		f.input :intro, :input_html => {:class => "ckeditor"}
  		f.input :body, :input_html => {:class => "ckeditor"}
  		f.input :author
  		f.input :status, :collection => ['published','p-featured']
      f.input :category, :collection => ['running','reviews']
      f.input :tag_list, :hint => "Comma delimited"
      f.input :group_list, :hint => 'Comma delimited'
  	end
  	f.buttons
	end
  show do |post|
    attributes_table do
      row :id
      row :title
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
