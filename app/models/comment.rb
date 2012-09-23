class Comment < ActiveRecord::Base
  attr_accessible :name, :email, :body

  validates :name, presence: true
  validates :body, presence: true

  belongs_to :post

  scope :published, where{{ status.in => ['published'] }}

end
