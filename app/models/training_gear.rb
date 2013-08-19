class TrainingGear < ActiveRecord::Base
  attr_accessible :title, :title_picture_id, :details, :description, :status, :category, :published_on, :amazon, :gender, :gear
  set_table_name 'Training_Gear'
  validates :title, presence: true
  validates :description, presence: true

  scope :published, where{{ status.in => ['published']}}
  scope :recent, order("published_on DESC")

  belongs_to :title_picture, class_name: 'Ckeditor::Picture'

  before_save :set_published_on

  def is_published?
  	['published'].include? status
  end

  def set_published_on
  	if is_published? && published_on.nil?
  		self.published_on = Time.zone.now.to_date
  	end
  end
end
