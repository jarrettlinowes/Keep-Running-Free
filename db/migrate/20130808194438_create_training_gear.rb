class CreateTrainingGear < ActiveRecord::Migration
  def change
    create_table :Training_Gear do |t|
      t.string :title
      t.text :details
      t.text :description
      t.string :status
      t.integer :title_picture_id
      t.string :category
      t.date :published_on
      t.string :gender
      t.text :amazon

      t.timestamps
    end
  end
end
