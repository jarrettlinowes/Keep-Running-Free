class AddTitleImageToPost < ActiveRecord::Migration
  def change
    add_column :posts, :title_picture_id, :integer
    #add_attachment :posts, :title_picture
  end
end
