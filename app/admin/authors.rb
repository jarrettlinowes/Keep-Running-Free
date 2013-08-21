ActiveAdmin.register Author do
  form do |f|
  	f.inputs do
  		f.input :name
  		f.input :about
  		f.input :title_picture_id
  	end
  	f.buttons
  end
end
