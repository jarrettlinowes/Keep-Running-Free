Paperclip::Attachment.default_options.merge!(
	storage: :s3,
	s3_credentials: "#{Rails.root}/config/s3.yml",
	bucket: Rails.env == 'production' ? 'krf-pro' : 'krf-dev'
)

#to do: Use Heroku ENV for s3 https://devcenter.heroku.com/articles/uploading-files-s3-rails-paperclip