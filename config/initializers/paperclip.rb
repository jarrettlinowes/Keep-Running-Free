Paperclip::Attachment.default_options.merge!(
	storage: :s3,
	s3_credentials: "#{Rails.root}/config/s3.yml"
)

#to do: Use Heroku ENV for s3 https://devcenter.heroku.com/articles/uploading-files-s3-rails-paperclip