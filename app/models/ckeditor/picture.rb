class Ckeditor::Picture < Ckeditor::Asset
  has_attached_file :data,
                    :url  => "/pictures/:id/:style_:basename.:extension",
                    :path => "/pictures/:id/:style_:basename.:extension",
	                  :styles => { :content => '625x285!', :flist => '429x196', :list => '175x80!', :feature => '700x319!', :front => '1031x469!', :sfeature => '327x149!' }
	
	validates_attachment_size :data, :less_than => 2.megabytes
	validates_attachment_presence :data
	validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
	
	def url_content
	  url(:content)
	end
end