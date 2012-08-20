class Ckeditor::Picture < Ckeditor::Asset
  has_attached_file :data,
                    :url  => "/pictures/:id/:style_:basename.:extension",
                    :path => "/pictures/:id/:style_:basename.:extension",
	                  :styles => { :content => '625x285!', :list => '134x61!', :thumb => '68x31!', :feature => '700x319!' }
	
	validates_attachment_size :data, :less_than => 2.megabytes
	validates_attachment_presence :data
	
	def url_content
	  url(:content)
	end
end
