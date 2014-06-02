ActionMailer::Base.delivery_method = :smtp
 
	ActionMailer::Base.smtp_settings = {
	:enable_starttls_auto => true,
	:address => 'smtp.gmail.com',
	:port => 587,
	:domain => 'meticufit.com',
	:user_name => 'admin@meticufit.com',
	:password => 'linowes!@9Mfit',
	:authentication => 'plain'
}