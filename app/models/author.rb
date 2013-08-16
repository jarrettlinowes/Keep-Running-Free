class Author < ActiveRecord::Base
	attr_accessible :name, :about, :title_picture_id

	validates :name, presence: true

end
