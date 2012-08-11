class Post < ActiveRecord::Base
	attr_accessible :title, :intro, :body, :status, :author_id, :category, :published_on, :views

	validates :title, presence: true
	validates :intro, presence: true
	validates :body, presence: true

	belongs_to :author

	scope :published, where{{ status.in => ['published', 'p-featured'] }}
end
