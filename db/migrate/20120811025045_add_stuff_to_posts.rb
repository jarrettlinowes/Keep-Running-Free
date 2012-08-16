class AddStuffToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :category, :string
  	add_column :posts, :published_on, :date
  	add_column :posts, :views, :integer
  end
end
