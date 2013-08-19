class AddGearToTrainingGear < ActiveRecord::Migration
  def change
  	add_column :training_gear, :gear, :string
  end
end
