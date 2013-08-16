class AddAuthorPictureToAuthors < ActiveRecord::Migration
  def change
  	add_column :authors, :title_picture_id, :integer
  end
end
