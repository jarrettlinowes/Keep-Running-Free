class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.references :post
      t.string :name
      t.string :email
      t.text   :body
      t.string :status
      t.timestamps
    end
  end
end
