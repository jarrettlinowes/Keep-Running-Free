class AddGearToTrainingGear < ActiveRecord::Migration
  def change
  	add_column :Training_Gear, :gear, :string
  end
end
