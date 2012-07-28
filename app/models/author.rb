class Author < ActiveRecord::Base
	attr_accessible :name, :about

	validates :name, presence: true

end
