class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.text :intro
      t.text :body
      t.string :status
      t.integer :author_id

      t.timestamps
    end
  end
end
