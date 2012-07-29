ActiveAdmin.register Post do
  index do
    column :title
    column :author
    column :status
    column :created_at
    column :updated_at
  end

end
