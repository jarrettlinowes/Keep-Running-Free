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
  		f.input :title
  		f.input :intro, :input_html => {:class => "ckeditor"}
  		f.input :body, :input_html => {:class => "ckeditor"}
  		f.input :author
  		f.input :status, :collection => ['published','p-featured']
      f.input :category, :collection => ['running','reviews']
  	end
  	f.buttons
	end
end
