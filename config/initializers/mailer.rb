ActionMailer::Base.delivery_method = :smtp
 
	ActionMailer::Base.smtp_settings = {
	:enable_starttls_auto => true,
	:address => 'smtp.gmail.com',
	:port => 587,
	:domain => 'yourdomain.com',
	:user_name => 'administrator[at]yourdomain.com',
	:password => 'yourpassword',
	:authentication => 'plain'
}