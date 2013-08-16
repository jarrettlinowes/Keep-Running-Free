ActiveAdmin.register Author do
  form do |f|
  	f.inputs do
  		f.input :name
  		f.input :about, :input_html => {:class => "ckeditor"}
  		f.input :title_picture_id
  	end
  	f.buttons
  end
end
