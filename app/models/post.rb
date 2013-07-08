class Post < ActiveRecord::Base
	attr_accessible :title, :title_picture_id, :intro, :body, :status, :author_id, :category, :published_on, :views

	validates :title, presence: true
	validates :intro, presence: true
	validates :body, presence: true

	belongs_to :author
  has_many :comments

	scope :published, where{{ status.in => ['published', 'p_featured'] }}
  scope :p_featured, where( status: 'p_featured' )
  scope :recent, order("published_on DESC")
	
	paginates_per 8
  
  acts_as_taggable_on :tags, :groups
  attr_accessible :tag_list, :group_list

  belongs_to :title_picture, class_name: 'Ckeditor::Picture'

  before_save :set_published_on

  def self.tag_list_for_display_on(name)
    Post.tag_counts_on(name).map {|tag| "#{tag.name}(#{tag.count})"}.join(', ')
  end

  def is_published?
    ['published', 'p_featured'].include? status
  end

  def tags_count
    tags_on(:tags).count
  end

  def groups_count
    tags_on(:groups).count
  end

  def related_posts
    @related_posts ||= begin
      related = find_related_groups
      related = related.select {|post| post.is_published? }
      related[0..2]
    end
  end

  # before_save
  def set_published_on
    if is_published? && published_on.nil?
      self.published_on = Time.zone.now.to_date
    end
  end

end
